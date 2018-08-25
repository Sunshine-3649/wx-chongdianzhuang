// pages/carfans/pages/carfansdetail/carfansdetail.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    uid: "",
    bbsId: "", // id
    carClueInfo: {}, // 详情
    commentId: "", // 评论ID，评论时不传，回复时传评论ID
    page: 1, // 评论页
    pagesize: 5, // 评论条数
    count: 0, // 评论总条数
    commentList: [], // 评论列表
    content: "", // 评论内容
    focus: false, // 是否聚焦
    isShow: true, // 隐藏输入框
    content: "" // textaarea内容
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      bbsId: options.bbsId
    });
    this.getBbsInfo();
    this.getCommentList();
    this.getUserInfo();
  },
  // 点击用户举报
  reportClick(e) {
    console.log(e);
    let bbsId = e.currentTarget.id;
    console.log(bbsId);
    let that = this;
    wx.showModal({
      title: "提示",
      content: "确定要举报吗？",
      success: function(res) {
        if (res.confirm) {
          that.reportBbs(bbsId);
        } else if (res.cancel) {
          wx.showToast({
            title: '已取消',
            icon: 'loading',
            duration: 1200
          })
        }
      }
    });
  },
  // 举报信息
  reportBbs(bbsId) {
    app.http.req(
      "/bbs/reportBbs",
      {
        token: app.data.token,
        bbsId: bbsId
      },
      res => {
        if (res.data.status === 200) {
          wx.showToast({
            title: '已举报！',
            icon: 'success',
            duration: 1500
          })
        }
      }
    );
  },
  // 查看用户详情
  toUserDetail(e) {
    wx.navigateTo({
      url: "/pages/userdetail/userdetail?uid=" + e.currentTarget.id
    });
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
        if (res.data.status === 200) {
          let result = res.data.data || {};
          that.setData({
            uid: result.uid
          });
        }
      }
    );
  },
  // 获取详情
  getBbsInfo() {
    const that = this;
    wx.showLoading({
      title: "加载中",
      mask: true
    });
    let params = {
      token: app.data.token, // 登录凭证
      bbsId: that.data.bbsId //
    };
    app.http.req("/bbs/getBbsInfo", params, res => {
      console.log(res);
      wx.hideLoading();
      if (res.data.status === 200) {
        let carClueInfo = res.data.data || {};
        if (carClueInfo.createTime) {
          carClueInfo.createTime = carClueInfo.createTime.replace("-", "/");
          carClueInfo.createTime = carClueInfo.createTime.replace("-", "/");
          let oldTime = new Date(carClueInfo.createTime).getTime();
          let newTime = new Date().getTime();
          let time = Math.ceil((newTime - oldTime) / 1000 / 60);
          if (time < 60) {
            carClueInfo.beforeTime = time + "分钟";
          } else if (time >= 60 && time < 1440) {
            carClueInfo.beforeTime = parseInt(time / 60) + "小时";
          } else {
            carClueInfo.beforeTime = parseInt(time / 1440) + "天";
          }
        }
        that.setData({
          carClueInfo: carClueInfo
        });
      }
    });
  },
  // 查看选择的图片
  previewImage: function(e) {
    var current = e.target.dataset.src;
    console.log(this.data.upLoadImgArr);
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: this.data.carClueInfo.bbsImg // 需要预览的图片http链接列表
    });
  },
  // 显示评论输入框
  addCommentShow() {
    this.setData({
      commentId: "",
      content: "",
      isShow: false,
      focus: true
    });
  },
  // 隐藏评论输入框
  hideCommentShow() {
    this.setData({
      isShow: true,
      focus: false,
      content: ""
    });
  },
  // 评论内容
  myContent(e) {
    this.setData({
      content: e.detail.value
    });
  },
  // 添加回复
  replyCommentShow(e) {
    console.log(e.currentTarget.id);
    this.setData({
      commentId: e.currentTarget.id,
      content: "",
      isShow: false,
      focus: true
    });
  },
  // 删除评论
  delComment(e) {
    const that = this;
    let params = {
      token: app.data.token, // 登录凭证
      commentId: e.currentTarget.id // 评论ID，评论时不传，回复时传评论ID
    };
    console.log(params);
    wx.showModal({
      title: "提示",
      content: "确定要删除这条评论吗？",
      success: function(res) {
        if (res.confirm) {
          app.http.req("/comment/delComment", params, res => {
            console.log(res);
            if (res.data.status === 200) {
              // that.getBbsInfo();
              that.setData({
                commentList: [],
                page: 1
              });
              that.getCommentList();
              wx.showToast({
                title: "删除成功",
                icon: "success",
                duration: 1000
              });
              that.setData({
                commentId: ""
              });
            }
          });
        } else if (res.cancel) {
          wx.showToast({
            title: "已取消",
            icon: "success",
            duration: 1000
          });
        }
      }
    });
  },
  // 添加评论
  addComment() {
    const that = this;
    let publicParams = {
      token: app.data.token, // 登录凭证
      flag: 2, // 1:充电桩，2：论坛
      chargeId: that.data.bbsId, // 充电桩ID
      commentId: that.data.commentId, // 评论ID，评论时不传，回复时传评论ID
      content: that.data.content // 评论内容
    };
    let params = {}; // 请求参数
    Object.keys(publicParams).forEach(key => {
      if (publicParams[key] !== "") {
        params[key] = publicParams[key];
      }
    });
    console.log(params);
    app.http.req("/comment/addComment", params, res => {
      console.log(res);
      if (res.data.status === 200) {
        // this.getBbsInfo();
        this.setData({
          commentList: [],
          page: 1
        });
        this.getCommentList();
        wx.showToast({
          title: "成功",
          icon: "success",
          duration: 1000
        });
        that.hideCommentShow();
      }
    });
  },
  // 获取评论详情
  getCommentList() {
    const that = this;
    let params = {
      token: app.data.token, // 登录凭证
      chargeId: that.data.bbsId, // 论坛ID
      flag: 2,
      page: that.data.page,
      pagesize: that.data.pagesize
    };
    console.log(params);
    app.http.req("/comment/getCommentList", params, res => {
      console.log(res);
      if (res.data.status === 200) {
        const result = res.data.data.list || [];
        that.setData({
          commentList: [...that.data.commentList, ...result],
          count: res.data.data.total || 0
        });
      }
    });
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  lower: function() {
    console.log("上拉");
    const that = this;
    let allcount = that.data.count;
    let page = that.data.page;
    let length = that.data.commentList.length;
    if (length < allcount) {
      page += 1;
      if (Math.ceil(allcount / 5) == page) {
        page = Math.ceil(allcount / 5);
      }
      that.setData({
        page: page
      });
      that.getCommentList();
    } else {
      console.log("加载完毕");
      // this.setData({
      //   isNomore: false
      // });
    }
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
  onShareAppMessage: function() {}
});
