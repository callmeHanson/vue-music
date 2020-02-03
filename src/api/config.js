export const commonParams = {
  g_tk: 799023101,
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0,
  format: 'jsonp'
}

export const options = {
  param: 'jsonpCallback',
  prefix: 'jp'
}

export const ERR_OK = 0

const urlMap = {
  development: "/",
  production: "http://www.bosaidong.work/music/"
}

export const baseUrl = urlMap["production"]
