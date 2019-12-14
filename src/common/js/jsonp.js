import originJsonp from 'jsonp'

/**
 * @param {*} url
 * @param {*} data
 * @param {*} options
 */
function jsonp(url, data, options) {
  return new Promise((resolve, reject) => {
    const params = param(data)
    if (params) url += (url.indexOf('?') < 0 ? '?' : '&') + params
    originJsonp(url, options, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}
function param(data) {
  let url = ''
  for (let k in data) {
    const value = data[k] !== undefined ? data[k] : ''
    url += `&${k}=${encodeURIComponent(value)}`
  }
  return url ? url.substring(1) : ''
}
export default jsonp