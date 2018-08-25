// pages/myself/pages/myorder/myorder.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    token: "", // 用户token
    searchText: "", // 搜索内容
    page: 1, // 页码
    pagesize: 5, //	每页条数
    carCount: 0, // 公共电站总数
    carClueList: [], // 车友会数据列表
    isNomore: true, // 加载完毕
    currentIndex: "a",
    categories: [
      "语文",
      "数学",
      "英语",
      "物理",
      "化学",
      "生物",
      "政治",
      "历史",
      "地理"
    ],
    currentFold: "b",
    carList: [1, 2, 3, 4, 5, 6]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(app.data.token);
    this.setData({
      token: app.data.token
    });
    this.getBbsListByUid();
  },
  // 获取论坛列表
  getBbsListByUid() {
    const that = this;
    wx.showLoading({
      title: "加载中",
      mask: true
    });
    let publicParams = {
      token: that.data.token, // 登录凭证
      page: that.data.page, // 开始页面
      pagesize: that.data.pagesize //	每页条数
    };
    let params = {}; // 请求参数
    Object.keys(publicParams).forEach(key => {
      if (publicParams[key] !== "") {
        params[key] = publicParams[key];
      }
    });
    console.log(params);
    app.http.req("/bbs/getBbsListByUid", params, res => {
      console.log(res);
      wx.hideLoading();
      wx.hideNavigationBarLoading(); //完成停止加载
      if (res.data.status === 200) {
        let carList = res.data.data.list1 || [];
        carList.forEach(item => {
          item.isFold = true;
          if (item.createTime) {
            let oldTime = new Date(item.createTime).getTime();
            let newTime = new Date().getTime();
            let time = Math.ceil((newTime - oldTime) / 1000 / 60);
            if (time < 60) {
              item.beforeTime = time + "分钟";
            } else if (time >= 60 && time < 1440) {
              item.beforeTime = parseInt(time / 60) + "小时";
            } else {
              item.beforeTime = parseInt(time / 1440) + "天";
            }
          }
        });
        console.log(carList);
        that.setData({
          carClueList: [...that.data.carClueList, ...carList],
          carCount: res.data.data.count || 0,
          searchText: "",
          isNomore: carList.length < res.data.data.count
        });
      }
    });
  },
  // 点击删除我的发布
  delete(e) {
    const that = this;
    console.log(e);
    const bbsId = parseInt(e.currentTarget.id);
    wx.showModal({
      title: "提示",
      content: "确定要删除这个内容吗？",
      success: function(res) {
        if (res.confirm) {
          console.log("用户点击确定");
          that.deleteBbs(bbsId);
        } else if (res.cancel) {
          console.log("用户点击取消");
        }
      }
    });
  },
  // 接口调用删除我的发布
  deleteBbs(bbsId) {
    app.http.req(
      "/bbs/deleteBbs",
      {
        token: app.data.token,
        bbsId: bbsId
      },
      res => {
        if (res.data.status === 200) {
          wx.showToast({
            title: "成功",
            icon: "success",
            duration: 1500
          });
          setTimeout(() => {
            this.setData({
              page: 1, // 开始页面
              pagesize: 5, //	每页条数
              carClueList: []
            });
            this.getBbsListByUid();
          }, 1600);
        }
      }
    );
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},
  // 公共上滑到顶部
  publicupper: function(e) {},
  // 公共上滑到底部
  publiclower: function(e) {},
  // 跳转到详情页
  toCarfansDetail(e) {
    wx.navigateTo({
      url:
        "/pages/carfans/pages/carfansdetail/carfansdetail?bbsId=" +
        e.currentTarget.id
    });
  },
  // 展开和折叠
  foldClick(e) {
    const that = this;
    let isFlag = false;
    let currentIndex = "b";
    let idx = parseInt(e.currentTarget.id);
    let carClueList = that.data.carClueList;
    carClueList[idx].isFold = !carClueList[idx].isFold;
    // carClueList.forEach(item => {
    //   if (item.isFold) {
    //     isFlag = true
    //     return false;
    //   } else {
    //     isFlag = false;
    //   }
    // })
    // if (isFlag) {
    //   currentIndex = 'b';
    // } else {
    //   currentIndex = 'a';
    // }
    this.setData({
      carClueList: carClueList
    });
  },
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
  onPullDownRefresh: function() {
    console.log("下拉");
    wx.showNavigationBarLoading(); //在标题栏中显示加载
    const that = this;
    that.setData({
      page: 1,
      carClueList: []
    });
    wx.stopPullDownRefresh();
    that.getBbsListByUid();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    const that = this;
    let allcount = that.data.carCount;
    let page = that.data.page;
    let length = that.data.carClueList.length;
    if (length < allcount) {
      page += 1;
      that.setData({
        page: page
      });
      that.getBbsListByUid();
    } else {
      console.log("加载完毕");
      this.setData({
        isNomore: false
      });
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
