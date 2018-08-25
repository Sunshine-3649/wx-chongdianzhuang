// pages/index/pages/indexfilter/indexfilter.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    token: "8e23ef214dc83f11f7346e7753611106c67d40fb", // 用户token
    interfaceType: "", // 充电接口，1：国际接口，2：特斯拉
    isPublic: "", // 属性，1：公共，2：私人
    isGround: "", // 电桩位置，1：地上，2：地下
    isFast: "", // 是否快充，1：直流快充，2：交流慢充
    isParkMoney: "", // 是否免费停车，1：免费
    operatorId: "", // 	运营商ID
    isMore: false, // 运营商是否加载全部
    yunyingList: [1, 2, 3, 4, 5, 6], // 显示的数据
    allyunyingList: [], // 全部数据
    quoyunyingList: [] // 8条数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(app.data.token);
    this.setData({
      token: app.data.token
    });
    let params= {
      token: this.data.token
    };
    this.getOperatorList(params);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

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
  // 充电接口点击点选
  interfaceTypeChose(e) {
    console.log(e.currentTarget.id);
    this.setData({
      interfaceType: e.currentTarget.id
    });
  },
  // 属性点击点选
  isPublicChose(e) {
    console.log(e.currentTarget.id);
    this.setData({
      isPublic: e.currentTarget.id
    });
  },
  // 电桩位置点击点选
  isGroundChose(e) {
    console.log(e.currentTarget.id);
    this.setData({
      isGround: e.currentTarget.id
    });
  },
  // 是否快充点击点选
  isFastChose(e) {
    console.log(e.currentTarget.id);
    this.setData({
      isFast: e.currentTarget.id
    });
  },
  // 是否免费停车点击点选
  isParkMoneyChose(e) {
    console.log(e.currentTarget.id);
    this.setData({
      isParkMoney: e.currentTarget.id
    });
  },
  // 运营商ID点击点选
  operatorIdChose(e) {
    console.log(e.currentTarget.id == 3);
    this.setData({
      operatorId: e.currentTarget.id
    });
  },
  // 更多
  more() {
    this.setData({
      yunyingList: this.data.allyunyingList || [],
      isMore: false
    });
  },
  // 折叠
  less() {
    this.setData({
      yunyingList: this.data.quoyunyingList || [],
      isMore: true
    });
  },
  getOperatorList(params) {
    const that = this;
    app.http.req("/operator/getOperatorList", params, res => {
      console.log(res);
      if (res.data.status === 200) {
        console.log(res.data.data);
        if (res.data.data.length > 8) {
          that.setData({
            yunyingList: res.data.data.slice(0, 8) || [],
            isMore: true
          });
          that.setData({
            allyunyingList: res.data.data || []
          });
          that.setData({
            quoyunyingList: res.data.data.slice(0, 8) || []
          });
        } else {
          that.setData({
            yunyingList: res.data.data || [],
            isMore: false
          });
        }
      }
    });
  },
  search() {
    let params = {
      interfaceType: this.data.interfaceType, // 充电接口，1：国际接口，2：特斯拉
      // isPublic: this.data.isPublic, // 属性，1：公共，2：私人
      // isGround: this.data.isGround, // 电桩位置，1：地上，2：地下
      isFast: this.data.isFast, // 是否快充，1：直流快充，2：交流慢充
      isParkMoney: this.data.isParkMoney, // 是否免费停车，1：免费
      operatorId: this.data.operatorId // 	运营商ID
    };
    let paramsStr = JSON.stringify(params);
    wx.setStorageSync('searchId', paramsStr);
    wx.switchTab({
      url: "/pages/index/index"
    });
  },
});
