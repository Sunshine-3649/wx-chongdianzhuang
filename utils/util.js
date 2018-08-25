// 时间毫米数转换00/00/00/ 00:00:00
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 封装请求方法
// const rootUrl = 'https://chong.rbson.net/prod'; // 正式-你的域名
const rootUrl = 'https://chong.rbson.net/dev'; // 测式-你的域名
const req = function (url, data, cb) {
  wx.request({
    url: rootUrl + url,
    data: data,
    method: 'POST',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      return typeof cb == "function" && cb(res)
    },
    fail: function () {
      return typeof cb == "function" && cb(false)
    }
  })
}

module.exports = {
  formatTime: formatTime,
  http: req
}



