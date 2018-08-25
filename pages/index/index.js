// pages/index/index.js
var app = getApp();
var address = require('../../utils/city.js');
var animation;
Page({
  /**
   * 页面的初始数据
   * 当前    provinces:所有省份
   * citys选择省对应的所有市,
   * areas选择市对应的所有区
   * provinces：当前被选中的省
   * city当前被选中的市
   * areas当前被选中的区
   */
  data: {
    menuType: 0,
    begin: null,
    status: 1,
    end: null,
    isVisible: false,
    animationData: {},
    animationAddressMenu: {},
    addressMenuIsShow: false,
    value: [0, 0, 0],
    provinces: [],
    citys: [],
    areas: [],
    userInfo: null,
    province: '',
    country: '',
    searchInput: '',
    currentIndex: '1',
    publicList: [], // 公共电站列表
    count: 0, // 公共电站总数
    token: '', // 登录凭证
    page: 1, // 开始页面
    pagesize: 5, // 公共电站条数
    city: '杭州市', // 当前城市
    city1: '', // 微信获取当前城市
    latitude: '', // 纬度
    longitude: '', // 经度
    interfaceType: '', // 充电接口
    isPublic: 1, // 	属性，1：公共，2：私人
    isGround: '', // 电桩位置
    isFast: '', // 	是否快充
    isParkMoney: '', // 是否免费停车
    operatorId: '', // 运营商ID
    searchText: '', // 搜索条件
    privateList: [],
    isNomore: true // 加载完毕
  },
  onReady: function() {
    // 生命周期函数--监听页面初次渲染完成
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this;
    wx.clearStorageSync();
    that.login();

    // 初始化动画变量
    var animation = wx.createAnimation({
      duration: 500,
      transformOrigin: '50% 50%',
      timingFunction: 'ease'
    });
    this.animation = animation;
    // 默认联动显示北京
    var id = address.provinces[0].id;
    console.log(id);
    this.setData({
      provinces: address.provinces,
      citys: address.citys[id],
      areas: address.areas[address.citys[id][0].id]
    });
  },
  onShow: function() {
    // 生命周期函数--监听页面显示
    var searchText = wx.getStorageSync('searchText') || '';
    var searchIdStr = wx.getStorageSync('searchId');
    if (searchText) {
      this.setData({
        searchText: searchText || '', // 搜索条件
        page: 1
      });
    }
    if (searchIdStr) {
      var searchIdObj = JSON.parse(searchIdStr);
      console.log(searchIdObj);
      this.setData({
        page: 1,
        interfaceType: searchIdObj.interfaceType || '', // 充电接口
        // isPublic: searchIdObj.isPublic || "", // 	属性
        // isGround: searchIdObj.isGround || "", // 电桩位置
        isFast: searchIdObj.isFast || '', // 	是否快充
        isParkMoney: searchIdObj.isParkMoney || '', // 是否免费停车
        operatorId: searchIdObj.operatorId || '' // 运营商ID
      });
    }
    this.getChargeSitesList();
  },
  onHide: function() {
    wx.clearStorageSync();
    this.setData({
      publicList: []
    });
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    console.log('下拉');
    wx.showNavigationBarLoading(); //在标题栏中显示加载
    const that = this;
    that.setData({
      page: 1,
      interfaceType: '', // 充电接口
      isPublic: that.data.isPublic, // 	属性
      isGround: '', // 电桩位置
      isFast: '', // 	是否快充
      isParkMoney: '', // 是否免费停车
      operatorId: '', // 运营商ID
      searchText: '', // 搜索条件
      publicList: []
    });
    wx.stopPullDownRefresh();
    that.getChargeSitesList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    const that = this;
    let allcount = that.data.count;
    let page = that.data.page;
    let length = that.data.publicList.length;
    if (length < allcount) {
      page += 1;
      that.setData({
        page: page
      });
      that.getChargeSitesList();
    } else {
      console.log('加载完毕');
      this.setData({
        isNomore: false
      });
    }
  }, // 用户登录
  login() {
    const that = this;
    wx.login({
      success: function(res) {
        var code = res.code; // 1.2微信登录接口返回的 code 参数，下面注册接口需要用到
        console.log(res);
        // 1.3验证获取用户信息时有敏感信息
        wx.getUserInfo({
          success: function(res) {
            // var iv = res.iv;
            // var encryptedData = res.encryptedData;
            console.log(res);
            that.data.avatar = res.userInfo.avatarUrl;
            that.data.nickname = res.userInfo.nickName;
            that.data.sex = res.userInfo.gender;
            that.data.province = res.userInfo.province;
            that.data.city1 = res.userInfo.city;
            that.data.country = res.userInfo.country;
            that.getOpenIdAndSessionKey(code);
          },
          fail: function() {
            wx.showToast({
              title: '授权失败，您将无法体验充充充...',
              mask: true,
              icon: 'none',
              duration: 5000
            });
          }
        });
      }
    });
  },
  // 获取用户openId
  getOpenIdAndSessionKey(code) {
    const that = this;
    app.http.req(
      '/weChat/getOpenIdAndSessionKey',
      {
        code: code
      },
      res => {
        if (res.data.status == 200) {
          that.setData({
            openId: res.data.data.openId
          });
          wx.getLocation({
            type: 'gcj02', //返回可以用于wx.openLocation的经纬度
            success: function(res) {
              console.log(res);
              var latitude = res.latitude;
              var longitude = res.longitude;
              that.setData({
                latitude: latitude,
                longitude: longitude
              });
              that.adminlogin();
            },
            fail: function() {
              wx.showToast({
                title: '授权失败，您将无法体验充充充...',
                mask: true,
                icon: 'none',
                duration: 5000
              });
            }
          });
        }
      }
    );
  },
  // 后台服务登录
  adminlogin() {
    const that = this;
    app.http.req(
      '/user/login',
      {
        openId: that.data.openId,
        avatar: that.data.avatar,
        nickname: that.data.nickname,
        sex: that.data.sex,
        province: that.data.province,
        city: that.data.city1,
        country: that.data.country
      },
      res => {
        console.log(res.data.status);
        if (res.data.status == 200) {
          that.data.token = res.data.data.token;
          app.data.token = res.data.data.token;
          console.log(that.data.token);
          that.getChargeSitesList();
        }
      }
    );
  },
  // 获取公共电站列表信息
  getChargeSitesList() {
    const that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    let publicParams = {
      token: that.data.token, // 登录凭证
      // token: '8e23ef214dc83f11f7346e7753611106c67d40fb', // 登录凭证
      page: that.data.page, // 开始页面
      pagesize: that.data.pagesize, // 公共电站条数
      city: that.data.city, // 当前城市
      latitude: that.data.latitude, // 纬度
      longitude: that.data.longitude, // 经度
      interfaceType: that.data.interfaceType, // 充电接口
      isPublic: that.data.isPublic, // 	属性
      isGround: that.data.isGround, // 电桩位置
      isFast: that.data.isFast, // 	是否快充
      isParkMoney: that.data.isParkMoney, // 是否免费停车
      operatorId: that.data.operatorId, // 运营商ID
      searchText: that.data.searchText // 搜索条件
    };
    let params = {}; // 请求参数
    Object.keys(publicParams).forEach(key => {
      if (publicParams[key] !== '') {
        params[key] = publicParams[key];
      }
    });
    console.log(params);
    app.http.req('/chargeSites/getChargeSitesList', params, res => {
      console.log(res);
      wx.hideNavigationBarLoading(); //完成停止加载
      wx.hideLoading();
      if (res.data.status === 200) {
        let result = res.data.data.list1 || [];
        result.forEach(item => {
          if (item.operatorName.length > 4) {
            item.operatorName = item.operatorName.substr(0, 4);
          }
          if (item.distance && item.distance > 1000) {
            item.distance = parseInt(item.distance / 1000) + 'k';
          }
        });
        that.setData({
          publicList: [...that.data.publicList, ...result],
          count: res.data.data.count || 0,
          isNomore: res.data.data.count > result.length
        });
        console.log(that.data.publicList);
      }
    });
  },
  // 重置请求参数
  resetParams() {
    this.setData({
      searchText: '', // 搜索条件
      interfaceType: '', // 充电接口
      isPublic: this.data.isPublic, // 	属性
      isGround: '', // 电桩位置
      isFast: '', // 	是否快充
      isParkMoney: '', // 是否免费停车
      operatorId: '' // 运营商ID
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},
  //
  // 公共下滑到顶部
  publicupper: function(e) {},
  // 公共上滑到底部
  publiclower: function(e) {},
  // 公共滚动时间
  publicscroll: function(e) {
    console.log('scroll');
  },
  // 个人上滑到顶部
  privateupper: function(e) {
    console.log('upper');
  },
  // 个人上滑到底部
  privatelower: function(e) {
    const that = this;
    let currentList = that.data.publicList;
    currentList.push(currentList.length + 1);
    if (Math.random() > 0.5) {
      that.setData({
        publicList: currentList
      });
      console.log('增加');
    } else {
      console.log('不增加');
    }
  },
  // 个人滚动时间
  privatescroll: function(e) {
    console.log('scroll');
  },
  scrollToTop: function(e) {
    this.setAction({
      scrollTop: 0
    });
  },
  // 点击切换类名
  toggleClass(e) {
    // 清空请求参数
    this.resetParams();
    this.setData({
      publicList: [],
      page: 1,
      pagesize: 5
    });
    this.setData({
      currentIndex: e.currentTarget.id,
      isPublic: e.currentTarget.id
    });
    this.getChargeSitesList();
  },

  // 点击公共列表跳转到详情页
  toPublicDetailsTap: function(e) {
    console.log(e.currentTarget.dataset.chargeid);
    wx.navigateTo({
      url:
        '/pages/index/pages/publicdetail/publicdetail?chargeId=' +
        e.currentTarget.dataset.chargeid +
        '&distance=' +
        e.currentTarget.dataset.distance
    });
  },
  // 点击个人列表跳转到详情页
  toPrivateDetailsTap: function(e) {
    wx.navigateTo({
      url: '/pages/index/pages/privatedetail/privatedetail'
    });
  },
  // 点击首页筛选跳转到筛选页面
  toIndexFilter() {
    this.resetParams();
    wx.navigateTo({
      url: '/pages/index/pages/indexfilter/indexfilter'
    });
  },
  // 点击搜索跳转搜索页面
  toSearch() {
    this.resetParams();
    wx.navigateTo({
      url: '/pages/indexsearch/indexsearch?searchId=1'
    });
  },
  // 点击所在地区弹出选择框
  selectDistrict: function(e) {
    var that = this;
    console.log(e);
    if (that.data.addressMenuIsShow) {
      return;
    }
    that.startAddressAnimation(true);
  },
  // 执行动画
  startAddressAnimation: function(isShow) {
    console.log(isShow);
    var that = this;
    if (isShow) {
      that.animation.translateY(0 + 'vh').step();
    } else {
      that.animation.translateY(40 + 'vh').step();
    }
    that.setData({
      animationAddressMenu: that.animation.export(),
      addressMenuIsShow: isShow
    });
  },
  // 点击地区选择取消按钮
  cityCancel: function(e) {
    this.startAddressAnimation(false);
  },
  // 点击地区选择确定按钮
  citySure: function(e) {
    var that = this;
    var city = that.data.city;
    var value = that.data.value;
    that.startAddressAnimation(false);
    // 将选择的城市信息显示到输入框
    // var areaInfo = that.data.provinces[value[0]].name + ',' + that.data.citys[value[1]].name + ',' + that.data.areas[value[2]].name
    var areaInfo = '';
    areaInfo =
      that.data.citys[value[1]].name == '市辖区'
        ? that.data.provinces[value[0]].name
        : that.data.citys[value[1]].name;
    that.setData({
      city: areaInfo,
      publicList: [],
      page: 1,
      pagesize: 5
    });
    console.log(areaInfo);
    // 清空请求参数
    that.resetParams();
    wx.clearStorageSync();
    that.getChargeSitesList();
  },
  hideCitySelected: function(e) {
    console.log(e);
    this.startAddressAnimation(false);
  },
  // 处理省市县联动逻辑
  cityChange: function(e) {
    console.log(e);
    var value = e.detail.value;
    var provinces = this.data.provinces;
    var citys = this.data.citys;
    var areas = this.data.areas;
    var provinceNum = value[0];
    var cityNum = value[1];
    var countyNum = value[2];
    if (this.data.value[0] != provinceNum) {
      var id = provinces[provinceNum].id;
      this.setData({
        value: [provinceNum, 0, 0],
        citys: address.citys[id],
        areas: address.areas[address.citys[id][0].id]
      });
    } else if (this.data.value[1] != cityNum) {
      var id = citys[cityNum].id;
      this.setData({
        value: [provinceNum, cityNum, 0],
        areas: address.areas[citys[cityNum].id]
      });
    } else {
      this.setData({
        value: [provinceNum, cityNum, countyNum]
      });
    }
    console.log(this.data);
  }
});
