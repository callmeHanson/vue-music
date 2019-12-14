import jsonp from "@/common/js/jsonp"
import axios from 'axios'

export function _getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  const params = {
    g_tk: 799023101,
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    format: 'jsonp',
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  }
  const options = {
    param: 'jsonpCallback'
  }
  return jsonp(url, params, options)
}

export function _getDictList() {
  return axios.get('/api/getDictList', {
    params: {
      g_tk: 799023101,
      inCharset: 'utf-8',
      outCharset: 'utf-8',
      notice: 0,
      platform: 'yqq',
      hostUin: 0,
      sin: 0,
      ein: 29,
      sortId: 5,
      needNewCode: 0,
      categoryId: 10000000,
      rnd: Math.random(),
      format: 'json'
    }
  }).then(resp => {
    return Promise.resolve(resp.data)
  })
}