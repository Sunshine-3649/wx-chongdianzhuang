var app = getApp();
Page({
  data: {
    brandList: [],
    carList: [],
    carItem: [],
    brandId: "350",
    carId: ""
  },
  onLoad: function(options) {
    // 生命周期函数--监听页面加载
    this.getCarAttributeList();
  },
  // 获取品牌数据
  getCarAttributeList() {
    const that = this;
    app.http.req(
      "/carAttribute/getCarAttributeList",
      {
        token: app.data.token
      },
      res => {
        console.log(res.data.status);
        if (res.data.status == 200) {
          let result = res.data.data,
            brandList = [],
            carList = [];
          result.forEach(item => {
            let brandItem = {};
            brandItem.brandId = item.brandId;
            brandItem.brandName = item.brandName;
            brandList.push(brandItem);
            carList.push(item.carModelEntities);
          });
          that.setData({
            brandList: brandList,
            carItem: carList[0],
            carList: carList
          });
        }
      }
    );
  },
  // 点击品牌
  brandCLick(e) {
    console.log(e.currentTarget.dataset);
    let obj = e.currentTarget.dataset;
    this.setData({
      carItem: this.data.carList[obj.idx],
      brandId: obj.id
    });
  },
  // 点击型号
  carCLick(e) {
    console.log(e.currentTarget.dataset);
    let obj = e.currentTarget.dataset;
    this.setData({
      carId: obj.id
    });
  },
  // 保存数据
  saveOrUpdate() {
    const that = this;
    if (!that.data.carId) {
      wx.showToast({
        title: "请先选择车型",
        icon: "loading",
        duration: 1200
      });
      return;
    }
    app.http.req(
      "/carAttribute/saveOrUpdate",
      {
        token: app.data.token,
        attrId: that.data.carId
      },
      res => {
        if (res.data.status == 200) {
          wx.showToast({
            title: "成功",
            icon: "success",
            duration: 1000
          });
          setTimeout(() => {
            wx.switchTab({
              url: "/pages/myself/myself"
            });
          }, 1200);
        }
      }
    );
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
