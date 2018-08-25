// pages/myself/myself.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    currentimg: "../../images/chose@2x.png",
    defPhone: "",
    phone: "",
    imgUrl: "../../images/readcount-on@2x.png"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取用户信息并保存
    // const that = this;
    // app.getUserInfo(function (userInfo) {
    //   console.log(userInfo);
    //   that.setData({
    //     userInfo: userInfo
    //   })
    // })
    // console.log(that.data.userInfo)
    // this.getUserInfo();
  },
  // 获取用户信息
  getUserInfo() {
    const that = this;
    let phone = "";
    let defPhone = "";
    wx.showLoading({
      title: "加载中",
      mask: true
    });
    app.http.req(
      "/user/getUserInfo",
      {
        token: app.data.token
      },
      res => {
        console.log(res);
        wx.hideLoading();
        if (res.data.status === 200) {
          let result = res.data.data || {};
          if (result.phone) {
            defPhone = result.phone;
            phone =
              result.phone.substr(0, 3) + "****" + result.phone.substr(7, 4);
          }
          that.setData({
            userInfo: result,
            phone: phone,
            defPhone: defPhone
          });
        }
      }
    );
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getUserInfo();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},
  // 切换图片
  toggleImg(e) {
    this.setData({
      currentimg: "../../images/weizhi@2x.png"
    });
  },
  userInfoHandler() {
    wx.getUserInfo({
      success: function(res) {
        var iv = res.iv;
        var encryptedData = res.encryptedData;
        console.log(res);
      },
      fail(res) {
        console.log(res);
      }
    });
  },
  // 切换手机显示状态
  toggle(e) {
    console.log(e.currentTarget.dataset.status);
    const that = this;
    let status = e.currentTarget.dataset.status;
    if (status == 0) {
      that.updateStatus(1);
    } else {
      that.updateStatus(0);
    }

  },
  updateStatus(status) {
    const that = this;
    app.http.req(
      "/user/updateStatus",
      {
        token: app.data.token,
        status: status
      },
      res => {
        if (res.data.status === 200) {
          console.log('chenggong');
          that.getUserInfo();
        }
      }
    );
  },
  // 显示图片
  showPhone(e) {
    const that = this;
    let defPhone = that.data.defPhone;
    let imgUrl = that.data.imgUrl;
    this.setData({
      phone: defPhone,
      imgUrl: imgUrl.replace("on", "off")
    });
  },
  hidePhone(e) {
    const that = this;
    let defPhone = that.data.defPhone;
    let imgUrl = that.data.imgUrl;
    this.setData({
      phone: defPhone.substr(0, 3) + "****" + defPhone.substr(7, 4),
      imgUrl: imgUrl.replace("off", "on")
    });
  }
});
