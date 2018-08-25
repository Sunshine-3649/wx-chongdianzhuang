// pages/index/pages/indexsearch/indexsearch.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    searchId: "", // 页面参数
    searchList: [],
    searchText: "",
    defualt: ''
  },
  searchValue(e) {
    console.log(e.detail.value);
    this.setData({
      searchText: e.detail.value
    });
  },
  // 点击历史记录出入输入框
  addSearchText(e) {
    const that = this;
    console.log(e.currentTarget.dataset.searchtext);
    let searchtext = e.target.dataset.searchtext;
    that.setData({
      defualt: searchtext
    });
  },
  toIndex() {
    console.log("111");
    const that = this;
    let searchText = that.data.searchText || that.data.defualt;
    if (that.data.searchId == "1") {
      wx.switchTab({
        url: "/pages/index/index"
      });
    } else if (that.data.searchId == '2') {
      wx.switchTab({
        url: "/pages/carfans/carfans"
      });
    }

    wx.setStorageSync("searchText", searchText);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    const that = this;
    that.setData({
      searchId: options.searchId
    });
    that.getSearchRecordList();
  },
  // 获取历史记录列表
  getSearchRecordList() {
    const that = this;
    let params = {
      token: app.data.token
    };
    app.http.req("/searchRecord/getSearchRecordList", params, res => {
      console.log(res);
      if (res.data.status === 200) {
        that.setData({
          searchList: res.data.data || []
        });
      }
    });
  },
  // 清除历史记录
  clearHistory() {
    const that = this;
    let searchIdsArr = [];
    that.data.searchList.forEach(item => {
      searchIdsArr.push(item.searchId);
    });
    console.log(searchIdsArr);
    if (searchIdsArr.length) {
      wx.showModal({
        title: "删除历史记录",
        content: "确定要删除全部历史记录吗？",
        success: function(res) {
          if (res.confirm) {
            console.log("用户点击确定");
            let searchIds = searchIdsArr.join();
            that.batchDelete(searchIds);
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
    } else {
      wx.showToast({
        title: "暂无删除内容。",
        // icon: 'success',
        duration: 1000
      });
    }
  },
  // 删除全部
  batchDelete(searchIds) {
    const that = this;
    let params = {
      token: app.data.token,
      searchIds: searchIds
    };
    app.http.req("/searchRecord/batchDelete", params, res => {
      console.log(res);
      if (res.data.status === 200) {
        that.getSearchRecordList();
        wx.showToast({
          title: "成功",
          icon: "success",
          duration: 1000
        });
      }
    });
  },
  onShareAppMesage: function() {}
});
