import jsonp from "@/common/js/jsonp"
import { commonParams, options, baseUrl } from './config'
import axios from "axios";

export function getHotKey() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
  const params = Object.assign({}, commonParams, {
    uin: 0,
    platform: 'h5',
    needNewCode: 1
  })
  return jsonp(url, params, options)
}

export function search(query, page, zhida) {
  const url = baseUrl + "api/search"

  const params = Object.assign({}, commonParams, {
    w: query,
    p: page,
    catZhida: zhida ? 1 : 0,
    zhidaqu: 1,
    _: +new Date(),
    g_tk: 5381,
    platform: 'h5',
    needNewCode: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    perpage: 20,
    n: 20,
    remoteplace: 'txt.mqq.all'
  })

  return axios.get(url, { params }).then(res => {
    return Promise.resolve(res.data)
  })
}