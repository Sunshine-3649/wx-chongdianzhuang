var app = getApp();
Page({
  data: {
    imgUrl: '../../images/readcount-on@2x.png',
    userInfo: '',
    phone: '',
    defPhone: ''
  },
  onLoad: function(options) {
    // 生命周期函数--监听页面加载
    console.log(options);
    const uid = options.uid * 1;
    this.getUserInfoByUid(uid);
  },
  // 获取用户信息
  getUserInfoByUid(uid) {
    const that = this;
    let phone = "";
    let defPhone = "";
    wx.showLoading({
      title: "加载中",
      mask: true
    });
    app.http.req(
      "/user/getUserInfoByUid",
      {
        token: app.data.token,
        uid: uid
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
  },  // 显示图片
  showPhone(e) {
    const that = this;
    let defPhone = that.data.defPhone;
    let imgUrl = that.data.imgUrl;
    this.setData({
      phone: defPhone,
      imgUrl: imgUrl.replace('on', 'off')
    });
  },
  hidePhone(e) {
    const that = this;
    let defPhone = that.data.defPhone;
    let imgUrl = that.data.imgUrl;
    this.setData({
      phone: defPhone.substr(0, 3) + '****' + defPhone.substr(7, 4),
      imgUrl: imgUrl.replace('off', 'on')
    });
  },
  onReady: function() {
    // 生命周期函数--监听页面初次渲染完成
  },
  onShow: function() {
    // 生命周期函数--监听页面显示
  },
  onHide: function() {
    // 生命周期函数--监听页面隐藏
  },
  onUnload: function() {
    // 生命周期函数--监听页面卸载
  },
  onPullDownRefresh: function() {
    // 页面相关事件处理函数--监听用户下拉动作
  },
  onReachBottom: function() {
    // 页面上拉触底事件的处理函数
  },
  onShareAppMessage: function() {
    // 用户点击右上角分享
    return {
      title: "title", // 分享标题
      desc: "desc", // 分享描述
      path: "path" // 分享路径
    };
  }
});
