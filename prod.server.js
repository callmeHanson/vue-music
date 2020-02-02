var express = require("express")
var config = require("./config/index")
var axios = require('axios')
const bodyParser = require('body-parser')

var app = express()
var apiRoutes = express.Router()

apiRoutes.get('/getDictList', (req, res) => {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  axios.get(url, {
    headers: {
      referer: "https://c.y.qq.com/",
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then(resp => {
    res.json(resp.data)
  }).catch(e => console.log(e))
})
apiRoutes.get('/lyric', (req, res) => {
  const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
  axios.get(url, {
    headers: {
      referer: "https://c.y.qq.com/",
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then(resp => {
    let ret = resp.data
    // 1. format: json
    if (typeof ret === "string") {
      // 包含一个分组
      let reg = /^\w+\((\{[^()]+\})\)$/
      let matches = ret.match(reg)
      if (matches) {
        ret = JSON.parse(matches[1])
      }
    }
    // 2. format: jsonp
    res.json(ret)
  }).catch(e => console.log(e))
})
apiRoutes.get('/getCdInfo', (req, res) => {
  const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  axios.get(url, {
    headers: {
      referer: "https://c.y.qq.com/",
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then(resp => {
    let ret = resp.data
    // 1. format: json
    if (typeof ret === "string") {
      // 包含一个分组
      let reg = /^\w+\((.+)\)$/
      let matches = ret.match(reg)
      if (matches) {
        ret = JSON.parse(matches[1])
      }
    }
    // 2. format: jsonp
    res.json(ret)
  }).catch(e => console.log(e))
})
apiRoutes.get('/search', (req, res) => {
  const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
  axios.get(url, {
    headers: {
      referer: "https://c.y.qq.com/",
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then(resp => {
    let ret = resp.data
    // 1. format: json
    if (typeof ret === "string") {
      // 包含一个分组
      let reg = /^\w+\((.+)\)$/
      let matches = ret.match(reg)
      if (matches) {
        ret = JSON.parse(matches[1])
      }
    }
    // 2. format: jsonp
    res.json(ret)
  }).catch(e => console.log(e))
})
apiRoutes.post('/getPurlUrl', bodyParser.json(), function (req, res) {
  const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
  axios.post(url, req.body, {
    headers: {
      referer: 'https://y.qq.com/',
      origin: 'https://y.qq.com',
      'Content-type': 'application/x-www-form-urlencoded'
    }
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
})

app.use('/api', apiRoutes)

app.use(express.static('./dist'))

var port = process.env.port || config.build.port

app.listen(port, function (err) {
  if (err) {
    console.log(err);
    return
  }
  console.log('Listening at http://localhost:' + port + '\n');

})