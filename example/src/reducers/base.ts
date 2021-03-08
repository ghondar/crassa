/* eslint-disable @typescript-eslint/no-explicit-any */
import produce from 'immer'
import { TakeableChannel } from 'redux-saga'

const Duck = require('extensible-duck').default

export interface DuckTypes {
  statuses: Record<string, string>;
  selectors: Record<string, (state: any, ...args: any[]) => any>;
  types: Record<string, TakeableChannel<unknown> & string>;
  store: string;
  sagas: Record<string, (...args: any[]) => any>;
}

export interface DuckInitialState {
  status: string;
  error?: null;
}

export type Types = Record<string, any>

export interface Args {
  namespace: string;
  store: string;
  initialState: Record<string, any>;
  creators?: () => void;
  selectors?: () => void;
}

export default function createDuck({ namespace, store, initialState = {}, creators, selectors }: Args): any {
  return new Duck({
    consts: {
      statuses: [ 'NEW', 'LOADING', 'READY', 'SAVING', 'SAVED', 'DELETED', 'ERROR', 'CANCEL', 'EDITING' ]
    },
    creators,
    initialState: ({ statuses }: DuckTypes) => ({
      ...initialState,
      error : null,
      status: statuses.NEW
    }),
    namespace,
    reducer: (state: Types, action: Types, { types, statuses }: DuckTypes) => produce(state, draft => {
      switch (action.type) {
        case types.UPDATE:
          if(draft.status !== statuses.EDITING) draft.status = statuses.EDITING
            for (let key in action.payload) draft[key] = action.payload[key] // eslint-disable-line

          return
        case types.FETCH_PENDING:
          draft.status = statuses.LOADING

          return
        case types.FETCH_FULFILLED:
            for (let key in action.payload) draft[key] = action.payload[key] // eslint-disable-line
          draft.status = statuses.READY

          return
        case types.FETCH_FOR_PATH_FULFILLED:
          if(action.dataForPath) draft.dataForPath = action.dataForPath
            for (let key in action.payload) draft[key] = action.payload[key] // eslint-disable-line
          draft.status = statuses.READY

          return
        case types.FETCH_FOR_PATH_PENDING:
        case types.POST_PENDING:
        case types.PUT_PENDING:
        case types.PATCH_PENDING:
        case types.DELETE_PENDING:
          draft.status = statuses.SAVING

          return
        case types.POST_FULFILLED:
        case types.PUT_FULFILLED:
        case types.PATCH_FULFILLED:
          draft.status = statuses.SAVED
          if(action.id) draft.id = action.id
            for (let key in action.payload) draft[key] = action.payload[key] // eslint-disable-line

          return
        case types.DELETE_FULFILLED:
          draft.status = statuses.DELETED

          return
        case types.FETCH_FOR_PATH_FAILURE:
        case types.FETCH_FAILURE:
        case types.PUT_FAILURE:
        case types.POST_FAILURE:
        case types.PATCH_FAILURE:
        case types.DELETE_FAILURE:
          draft.status = statuses.ERROR
          draft.error = action.error

          return
        case types.FETCH_CANCEL:
        case types.POST_CANCEL:
        case types.PUT_CANCEL:
        case types.DELETE_CANCEL:
        case types.PATCH_CANCEL:
          draft.status = statuses.CANCEL

          return
        case types.RESET:
          return {
            ...initialState,
            error : null,
            status: statuses.NEW
          }
        default:
          return
      }
    }),
    selectors,
    store,
    types: [
      'REMOVE',
      'UPDATE',
      'FETCH',
      'FETCH_PENDING',
      'FETCH_FULFILLED',
      'FETCH_FAILURE',
      'FETCH_CANCEL',
      'FETCH_FOR_PATH',
      'FETCH_FOR_PATH_PENDING',
      'FETCH_FOR_PATH_FULFILLED',
      'FETCH_FOR_PATH_FAILURE',
      'PUT',
      'PUT_PENDING',
      'PUT_FULFILLED',
      'PUT_FAILURE',
      'PUT_CANCEL',
      'PUT',
      'POST',
      'POST_PENDING',
      'POST_FULFILLED',
      'POST_FAILURE',
      'POST_CANCEL',
      'DELETE',
      'DELETE_PENDING',
      'DELETE_FULFILLED',
      'DELETE_FAILURE',
      'DELETE_CANCEL',
      'RESET',
      'PATCH',
      'PATCH_PENDING',
      'PATCH_FULFILLED',
      'PATCH_FAILURE',
      'PATCH_CANCEL'
    ]
  })
}
