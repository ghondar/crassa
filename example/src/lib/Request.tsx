import axios, { CancelTokenSource, AxiosInstance } from 'axios'

const { REACT_APP_REST_API_LOCATION = 'http://localhost:5000', REACT_APP_API_VERSION = 'v1' } = process.env

export const baseURL = REACT_APP_REST_API_LOCATION + '/api/' + REACT_APP_API_VERSION + '/'

type Payload = Record<string, unknown>

function serialize(obj: Payload) {
  const str = []
  for (const p in obj) if(obj.hasOwnProperty(p)) str.push(encodeURIComponent(p) + '=' + obj[p])

  return str.join('&')
}

let _source: CancelTokenSource, beforeRoute: string

function verifyRequestCancel(route: string) {
  if(beforeRoute === route) {
    if(_source !== undefined) _source.cancel('Operation canceled due to new request.')
  } else {
    beforeRoute = route
  }
}

export const http = function(): AxiosInstance {
  _source = axios.CancelToken.source()

  const instance = axios.create({
    baseURL    : baseURL,
    cancelToken: _source.token
  })

  return instance
}

export function Put(route: string, json: Payload = {}): Promise<void> {
  return new Promise((resolve, reject) => {
    verifyRequestCancel(route)
    http()
      .put(route, json)
      .then(res => resolve(res.data))
      .catch(e => reject({ type: axios.isCancel(e) ? 'cancel' : 'err', ...e }))
  })
}

export function Delete(route: string, json: Payload = {}): Promise<void> {
  return new Promise((resolve, reject) => {
    verifyRequestCancel(route)
    http()
      .delete(route, { data: json })
      .then(res => resolve(res.data))
      .catch(e => {
        reject({ type: axios.isCancel(e) ? 'cancel' : 'err', ...e })
      })
  })
}

export function Patch(route: string, json: Payload = {}): Promise<void> {
  return new Promise((resolve, reject) => {
    verifyRequestCancel(route)
    http()
      .patch(route, json)
      .then(res => resolve(res.data))
      .catch(e => {
        reject({ type: axios.isCancel(e) ? 'cancel' : 'err', ...e })
      })
  })
}

export function Post(route: string, json: Payload = {}): Promise<void> {
  return new Promise((resolve, reject) => {
    verifyRequestCancel(route)
    http()
      .post(route, json)
      .then(res => resolve(res.data))
      .catch(e => {
        reject({ type: axios.isCancel(e) ? 'cancel' : 'err', ...e })
      })
  })
}

export function Get(route: string): Promise<void> {
  return new Promise((resolve, reject) => {
    verifyRequestCancel(route)
    http()
      .get(route)
      .then(res => {
        resolve(res.data)
      })
      .catch(e => {
        reject({ type: axios.isCancel(e) ? 'cancel' : 'err', ...e })
      })
  })
}

export function GetList(product: string, query: Payload): Promise<unknown> {
  return Get(product + '/?' + serialize(query))
}
