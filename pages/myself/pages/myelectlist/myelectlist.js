var app = getApp();
Page({
  data: {
    page: 1,
    pagesize: 9,
    electList: [],
    count: 0
  },
  onLoad: function(options) {
    // 生命周期函数--监听页面加载
  },
  onShow: function (options) {
    console.log('object');
    const that = this;
    that.setData({
      page: 1,
      pagesize: 9,
      electList: [],
      count: 0,
      isNomore: false
    });
    that.getUserChargeList();
  },
  onPullDownRefresh: function() {
    // 页面相关事件处理函数--监听用户下拉动作
    console.log('下拉');
    // wx.showNavigationBarLoading(); //在标题栏中显示加载
    const that = this;
    that.setData({
      page: 1,
      pagesize: 9,
      electList: [],
      count: 0,
      isNomore: false
    });
    wx.stopPullDownRefresh();
    that.getUserChargeList();
  },
  onReachBottom: function() {
    // 页面上拉触底事件的处理函数
    const that = this;
    let allcount = that.data.count;
    let page = that.data.page;
    let length = that.data.electList.length;
    if (length < allcount) {
      page += 1;
      that.setData({
        page: page
      });
      that.getUserChargeList();
    } else {
      console.log('加载完毕');
      this.setData({
        isNomore: false
      });
    }
  },
  // 跳转详情页
  toDetail(e) {
    const chargeId = e.currentTarget.id || '';
    wx.navigateTo({
      url: '/pages/myself/pages/myelect/myelect?chargeId=' + chargeId
    });
  },
  // 点击删除按钮
  delClick(e) {
    const that = this;
    let chargeId = e.currentTarget.id;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function(res) {
        if (res.confirm) {
          that.delCharge(chargeId);
        } else if (res.cancel) {
          wx.showToast({
            title: '已取消',
            icon: 'success',
            duration: 1200
          });
        }
      }
    });
  },
  // 获取列表
  getUserChargeList() {
    const that = this;
    app.http.req(
      '/chargeSites/getUserChargeList',
      {
        token: app.data.token,
        page: that.data.page,
        pagesize: that.data.pagesize
      },
      res => {
        if (res.data.status === 200) {
          that.setData({
            electList: [...that.data.electList, ...res.data.data.list] || [],
            count: res.data.data.total || 0,
            isNomore: res.data.data.total > res.data.data.list.length
          });
        }
      }
    );
  },
  // 删除充电桩
  delCharge(chargeId) {
    const that = this;
    app.http.req(
      '/chargeSites/delCharge',
      {
        token: app.data.token,
        chargeId: chargeId
      },
      res => {
        if (res.data.status === 200) {
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 1200
          });
          that.setData({
            page: 1
          });
          that.getUserChargeList();
        }
      }
    );
  }
});
