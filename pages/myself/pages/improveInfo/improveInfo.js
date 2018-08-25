//获取应用实例
const app = getApp();
Page({
  data: {
    telPhoneValue: "", // 手机号
    ageValue: "", // 年龄
    qmValue: "" // 签名
  },
  onLoad: function() {
    this.getUserInfo()
  },
  // 获取手机号
  bindPhoneInput: function(e) {
    var that = this;
    that.setData({
      telPhoneValue: e.detail.value
    });
    console.log(that.data.telPhoneValue);
  },
  // 获取年龄
  bindAgeInput: function(e) {
    var that = this;
    that.setData({
      ageValue: e.detail.value
    });
    console.log(that.data.ageValue);
  },
  // 获取个性签名
  bindQmInput: function(e) {
    var that = this;
    that.setData({
      qmValue: e.detail.value
    });
    console.log(that.data.qmValue);
  },

  // 提交完善的用户信息
  improveRelease: function() {
    var that = this;
    if (!that.data.telPhoneValue) {
      wx.showToast({
        title: "手机号不能为空",
        mark: true,
        icon: "loading",
        duration: 1500
      });
    }
    if (!that.data.ageValue) {
      wx.showToast({
        title: "年龄不能为空",
        mark: true,
        icon: "loading",
        duration: 1500
      });
    }
    if (that.data.ageValue <= 0) {
      wx.showToast({
        title: "年龄必须大于0",
        mark: true,
        icon: "loading",
        duration: 1500
      });
    }
    if (!that.data.qmValue) {
      wx.showToast({
        title: "签名不能为空",
        mark: true,
        icon: "loading",
        duration: 1500
      });
    }
    this.saveOrUpdate();
  },
  // 获取用户信息
  getUserInfo() {
    const that = this;
    app.http.req(
      "/user/getUserInfo",
      {
        token: app.data.token
      },
      res => {
        console.log(res);
        if (res.data.status === 200) {
          let result = res.data.data || {};
          that.setData({
            telPhoneValue: result.phone, // 手机号
            ageValue: result.age, // 年龄
            qmValue: result.sign // 签名
          });
        }
      }
    );
  },
  // 保存用户信息
  saveOrUpdate() {
    const that = this;
    let publicParams = {
      token: app.data.token, // 登录凭证
      phone: that.data.telPhoneValue, // 手机号
      age: that.data.ageValue, // 年龄
      sign	: that.data.qmValue // 个性签名
    };
    let params = {}; // 请求参数
    Object.keys(publicParams).forEach(key => {
      if (publicParams[key] !== "") {
        params[key] = publicParams[key];
      }
    });
    console.log(params);
    app.http.req("/user/saveOrUpdate", params, res => {
      console.log(res);
      if (res.data.status === 200) {
        wx.switchTab({
          url: "/pages/myself/myself"
        });
      }
    });
  }
});
