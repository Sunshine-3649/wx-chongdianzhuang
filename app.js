//app.js
const api = require("utils/util.js");
App({
  http: {
    req: api.http
  },
  onLaunch: function(options) {},
  data: {
    openId: "",
    avatar: "",
    nickname: "",
    sex: 1,
    region: "杭州",
    token: "",
    uname: ""
  },
  // 获取用户信息
  getUserInfo(cb) {
    let userInfo = {
      openId: this.data.openId,
      avatar: this.data.avatar,
      nickname: this.data.nickname,
      sex: this.data.sex,
      region: this.data.region
    };
    if (userInfo) {
      cb(userInfo);
    }
  }
});
