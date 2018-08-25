// pages/index/pages/publicdetail/publicdetail.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    uid: '',
    questionList: [1, 2], // 两个评价
    publicInfo: {}, // 详情
    chargeId: '', // 充电桩ID
    latitude: '', // 纬度
    longitude: '', // 经度
    page: 1, // 评论页
    pagesize: 5, // 评论条数
    count: 0, // 评论总条数
    commentList: [], // 评论列表
    chargeId: '', // 充电桩ID
    distance: '', // 距离
    commentId: '', // 评论ID，评论时不传，回复时传评论ID
    content: '', // 评论内容
    focus: false, // 是否聚焦
    isShow: true, // 隐藏输入框
    content: '', // textaarea内容
    voteInfo: [] // 投票信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(111222333);
    const that = this;
    // 获取用户信息并保存
    app.getUserInfo(function(userInfo) {
      that.setData({
        userInfo: userInfo
      });
    });
    console.log(options.chargeId);
    this.setData({
      chargeId: options.chargeId,
      distance: options.distance
    });
    this.getChargeSitesInfo();
    this.getCommentList();
    this.getChargeVoteInfo();
    this.getUserInfo();
  },
  // 获取用户信息
  getUserInfo() {
    const that = this;
    app.http.req(
      '/user/getUserInfo',
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
  // 查看用户详情
  toUserDetail(e) {
    wx.navigateTo({
      url: '/pages/userdetail/userdetail?uid=' + e.currentTarget.id
    });
  },
  // 投票(yes)
  checkCvIdYes(e) {
    const cvId = e.currentTarget.id;
    this.addOne(cvId, 1);
  },
  // 投票(no)
  checkCvIdNo(e) {
    const cvId = e.currentTarget.id;
    this.addOne(cvId, 2);
  },
  // 获取投票信息
  getChargeVoteInfo() {
    const that = this;
    app.http.req(
      '/chargeVote/getChargeVoteInfo',
      {
        token: app.data.token,
        // chargeId: "12212"
        chargeId: that.data.chargeId
      },
      res => {
        console.log(res);
        if (res.data.status === 200) {
          const result = res.data.data || [];
          result.forEach(item => {
            if (item.yesPercentage) {
              item.yesPersen = parseInt(item.yesPercentage);
            }
          });
          console.log(result);
          that.setData({
            voteInfo: result
          });
        }
      }
    );
  },
  // 充电桩投票
  addOne(cvId, flag) {
    const that = this;
    app.http.req(
      '/chargeVote/addOne',
      {
        token: app.data.token,
        cvId: cvId,
        flag: flag
      },
      res => {
        if (res.data.status === 200) {
          wx.showToast({
            title: '投票成功',
            icon: 'success',
            duration: 1200
          });
          that.getChargeVoteInfo();
        } else if (res.data.status == 11) {
          wx.showToast({
            title: res.data.msg,
            icon: 'loading',
            duration: 1200
          });
        }
      }
    );
  },
  openLocation() {
    var latitude = this.data.latitude * 1 || '';
    var longitude = this.data.longitude * 1|| '';
    if (latitude && longitude) {
      wx.openLocation({
        latitude: latitude,
        longitude: longitude,
        scale: 28
      });
    } else {
      wx.getLocation({
        type: 'gcj02', //返回可以用于wx.openLocation的经纬度
        success: function(res) {
          wx.openLocation({
            latitude: latitude,
            longitude: longitude,
            scale: 28
          });
        }
      });
    }
  },
  // 显示评论输入框
  addCommentShow() {
    this.setData({
      commentId: '',
      content: '',
      isShow: false,
      focus: true
    });
  },
  // 隐藏评论输入框
  hideCommentShow() {
    this.setData({
      isShow: true,
      focus: false,
      content: ''
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
      content: '',
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
      title: '提示',
      content: '确定要删除这条评论吗？',
      success: function(res) {
        if (res.confirm) {
          app.http.req('/comment/delComment', params, res => {
            console.log(res);
            if (res.data.status === 200) {
              that.setData({
                commentList: [],
                page: 1
              });
              that.getCommentList();
              wx.showToast({
                title: '删除成功',
                icon: 'success',
                duration: 1000
              });
              that.setData({
                commentId: ''
              });
            }
          });
        } else if (res.cancel) {
          wx.showToast({
            title: '已取消',
            icon: 'success',
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
      flag: 1, // 1:充电桩，2：论坛
      chargeId: that.data.chargeId, // 充电桩ID
      commentId: that.data.commentId, // 评论ID，评论时不传，回复时传评论ID
      content: that.data.content // 评论内容
    };
    let params = {}; // 请求参数
    Object.keys(publicParams).forEach(key => {
      if (publicParams[key] !== '') {
        params[key] = publicParams[key];
      }
    });
    console.log(params);
    app.http.req('/comment/addComment', params, res => {
      console.log(res);
      if (res.data.status === 200) {
        // this.getChargeSitesInfo();
        this.setData({
          commentList: [],
          page: 1
        });
        this.getCommentList();
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 1000
        });
        that.hideCommentShow();
      }
    });
  },
  // 获取充电桩详情
  getChargeSitesInfo() {
    const that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    let publicParams = {
      token: app.data.token, // 登录凭证
      // chargeId: 8785, // 充电桩ID
      chargeId: that.data.chargeId // 充电桩ID
      // latitude: that.data.latitude, // 纬度
      // longitude: that.data.longitude // 经度
    };
    let params = {}; // 请求参数
    Object.keys(publicParams).forEach(key => {
      if (publicParams[key] !== '') {
        params[key] = publicParams[key];
      }
    });
    console.log(params);
    app.http.req('/chargeSites/getChargeSitesInfo', params, res => {
      console.log(res);
      wx.hideLoading();
      if (res.data.status === 200) {
        if (res.data.data.imgUrl) {
          res.data.data.imgArr = res.data.data.imgUrl.split(',');
        }
        that.setData({
          publicInfo: res.data.data || {},
          latitude: res.data.data.latitude,
          longitude: res.data.data.longitude
        });
      }
    });
  },
  // 查看选择的图片
  previewImage: function(e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: this.data.publicInfo.imgArr // 需要预览的图片http链接列表
    });
  },
  // 获取评论详情
  getCommentList() {
    const that = this;
    let params = {
      token: app.data.token, // 登录凭证
      chargeId: that.data.chargeId, // 充电桩ID
      flag: 1,
      page: that.data.page,
      pagesize: that.data.pagesize
    };
    console.log(params);
    app.http.req('/comment/getCommentList', params, res => {
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  lower: function() {
    console.log('上拉');
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
      console.log('加载完毕');
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
