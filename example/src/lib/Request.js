import axios from 'axios'

const { REACT_APP_REST_API_LOCATION = 'http://localhost:5000', REACT_APP_API_VERSION = 'v1' } = process.env

export const baseURL = REACT_APP_REST_API_LOCATION + '/api/' + REACT_APP_API_VERSION + '/'

function serialize(obj) {
  var str = []
  for (var p in obj) if(obj.hasOwnProperty(p)) str.push(encodeURIComponent(p) + '=' + obj[p])

  return str.join('&')
}

let _source, beforeRoute

export const http = function() {
  _source = axios.CancelToken.source()

  let instance = axios.create({
    baseURL    : baseURL,
    cancelToken: _source.token,
    mode       : 'no-cors'
  })

  return instance
}

export function Put(route, json = {}) {
  return new Promise((resolve, reject) => {
    verifyRequestCancel(route)
    http()
      .put(route, json)
      .then(res => resolve(res.data))
      .catch(e => {
        reject({ type: axios.isCancel(e) ? 'cancel' : 'err', ...e })
      })
  })
}

export function Delete(route, json = {}) {
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

export function Patch(route, json = {}) {
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

export function Post(route, json = {}) {
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

export function Get(route) {
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

export function GetList(product, query) {
  return Get(product + '/?' + serialize(query))
}

function verifyRequestCancel(route) {
  if(beforeRoute === route) {
    if(_source !== undefined) _source.cancel('Operation canceled due to new request.')
  } else {
    beforeRoute = route
  }
}
