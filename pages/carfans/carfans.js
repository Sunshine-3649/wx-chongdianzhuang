var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    token: "", // 用户token
    searchText: "", // 搜索内容
    page: 1,
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
    // app.http.req("/chargeSites/getChargeSitesList", params, res => {
    //   console.log(res);
    //   if (res.data.status === 200) {
    //     that.setData({
    //       publicList: res.data.data.list1 || [],
    //       count: res.data.data.count
    //     });
    //   }
    // });
  },
  // 查看用户详情
  toUserDetail(e) {
    wx.navigateTo({
    url: "/pages/userdetail/userdetail?uid=" + e.currentTarget.id
    })
  },
  // 获取论坛列表
  getBbsList() {
    const that = this;
    wx.showLoading({
      title: "加载中",
      mask: true
    });
    let publicParams = {
      token: that.data.token, // 登录凭证
      bbsType: 1, // 1：车友会，2：桩友会
      page: that.data.page, // 开始页面
      searchText: that.data.searchText, // 搜索条件
      pagesize: that.data.pagesize //	每页条数
    };
    let params = {}; // 请求参数
    Object.keys(publicParams).forEach(key => {
      if (publicParams[key] !== "") {
        params[key] = publicParams[key];
      }
    });
    console.log(params);
    app.http.req("/bbs/getBbsList", params, res => {
      console.log(res);
      wx.hideLoading();
      wx.hideNavigationBarLoading(); //完成停止加载
      if (res.data.status === 200) {
        let carList = res.data.data.list1 || [];
        carList.forEach(item => {
          item.isFold = true;
          if (item.createTime) {
            console.log(item.createTime);
            item.createTime = item.createTime.replace("-", "/");
            item.createTime = item.createTime.replace("-", "/");
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
          console.log(item.attrName, item.attrName.length);
          if (item.attrName.length > 7) {
            item.attrName = item.attrName.substr(0, 7);
          }
        });
        console.log(carList);
        that.setData({
          carClueList: [...that.data.carClueList, ...carList],
          carCount: res.data.data.count || 0,
          searchText: "",
          isNomore: res.data.data.count < that.data.carClueList.length
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 重置数据
    this.setData({
      carClueList: [],
      page: 1,
      searchText: ""
    });
    // 生命周期函数--监听页面显示
    var searchText = wx.getStorageSync("searchText") || "";
    var isShow = wx.getStorageSync("isShow") || false;
    if (searchText) {
      this.setData({
        searchText: searchText || "" // 搜索条件
      });
      // this.getBbsList();
    }
    // if (isShow) {
    //   this.getBbsList();
    // }

    this.getBbsList();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    wx.clearStorageSync();
  },

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
      searchText: "", // 搜索内容
      page: 1,
      carClueList: []
    });
    wx.stopPullDownRefresh();
    that.getBbsList();
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
      that.getBbsList();
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
  onShareAppMessage: function() {},
  // 重置请求参数
  resetParams() {
    this.setData({
      searchText: "" // 搜索条件
    });
  },
  // 跳转到我的发布
  toPublish() {
    wx.navigateTo({
      url: "/pages/carfans/pages/carpublish/carpublish"
    });
  },
  // 点击搜索跳转搜索页面
  toSearch() {
    this.resetParams();
    wx.navigateTo({
      url: "/pages/indexsearch/indexsearch?searchId=2"
    });
  },
  // 跳转到详情页
  toCarfansDetail(e) {
    wx.navigateTo({
      url:
        "/pages/carfans/pages/carfansdetail/carfansdetail?bbsId=" +
        e.currentTarget.id
    });
  },
  // 公共上滑到顶部
  publicupper: function(e) {
    console.log("upper");
  },
  // 公共上滑到底部
  publiclower: function(e) {},
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
  // 点击切换类名
  toggleClass(e) {
    console.log(e);
    this.setData({
      currentIndex: e.currentTarget.id
    });
  },
  // 切换tab
  toggleFold(e) {
    const that = this;
    let carClueList = that.data.carClueList;
    if (e.currentTarget.id == "a") {
      carClueList.forEach(item => {
        item.isFold = false;
      });
      this.setData({
        currentFold: e.currentTarget.id,
        carClueList: carClueList
      });
    } else {
      carClueList.forEach(item => {
        item.isFold = true;
      });
      this.setData({
        currentFold: e.currentTarget.id,
        carClueList: carClueList
      });
    }
  }
});
