var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    timestar: '00:00',
    timeend: '23:59',
    value: [11, 22, 33],
    imgsArr: [],
    imglist: [],
    showlist: [], // 展示的图片数组
    isaddImgShow: true,
    nameValue: '', // 名称
    parkValue: '', // 停车费
    charValue: '', // 充电费
    servValue: '', // 服务费
    phoneValue: '', // 电话
    upLoadImgArr: [], // 图片数组
    flag: 1, // 1：添加，2：修改
    chargeId: '', // 充电桩ID
    location: '点击选择我的位置', // 默认的地址
    interfaceType: '', // 充电接口类型
    fastNum: '', // 快充
    slowNum: '', // 慢充
    latitude: '', // 纬度
    longitude: '', // 经度
    chargeName: '', // 充电桩名称
    parkExpense: '', // 停车费
    elecPrice: '', // 电费
    servPrice: '', // 服务费
    phone: '', // 电话号码
    city: '', // 城市
    province: '', // 省份
    isChecked: false // 同意
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.chargeId) {
      this.getChargeSitesInfo(options.chargeId);
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
  onShareAppMessage: function() {},

  radioChange(e) {
    this.setData({
      isChecked: !this.data.isChecked
    });
  },
  // 选择时间
  bindTimeChangeStar: function(e) {
    this.setData({
      timestar: e.detail.value
    });
  },
  bindTimeChangeEnd: function(e) {
    this.setData({
      timeend: e.detail.value
    });
  },
  // 选择图片
  choseImgs() {
    const that = this;
    var num = 0;
    // 选择照片
    wx.chooseImage({
      count: 9, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res) {
        var tempFilePaths = res.tempFilePaths;
        // console.log(tempFilePaths);
        for (var i in res.tempFilePaths) {
          if (that.data.imglist.length < 9) {
            that.data.imglist.push(res.tempFilePaths[i]);
            console.log(that.data.imglist);
            console.log(that.data.imglist.length);
            // 将图片上传到阿里云
            wx.uploadFile({
              url: 'https://chong.rbson.net/dev/oss/uploadImgs',
              filePath: tempFilePaths[i],
              name: 'imgs',
              formData: {
                imgs: tempFilePaths[i]
              },
              success: function(res) {
                console.log(res);
                var newRes = JSON.parse(res.data);
                that.data.upLoadImgArr.push(newRes.data.urlList[0]);
                console.log(newRes);
                console.log(that.data.upLoadImgArr);
              }
            });
          } else {
          }
        }
        that.setData({
          showlist: that.data.imglist
        });
        if (that.data.imglist.length > 7) {
          that.setData({
            isaddImgShow: false
          });
        }
      }
    });
  },
  // 查看选择的图片
  previewImage: function(e) {
    var current = e.target.dataset.src;
    console.log(this.data.upLoadImgArr);
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: this.data.showlist // 需要预览的图片http链接列表
    });
  },
  // 删除图片
  delfultImg: function(e) {
    var that = this;
    var id = e.currentTarget.id;
    console.log(id);
    that.data.showlist.splice(id, 1);
    that.data.imglist.splice(id, 1);
    that.data.upLoadImgArr.splice(id, 1);
    that.setData({
      showlist: that.data.showlist,
      imglist: that.data.imglist,
      upLoadImgArr: that.data.upLoadImgArr
    });
    console.log(that.data.showlist);
    console.log(that.data.imglist);
    console.log(that.data.upLoadImgArr);
    // if (that.data.showlist.length < 8) {
    //   that.setData({
    //     isaddImgShow: true
    //   });
    // } else {
    //   that.setData({
    //     isaddImgShow: false
    //   });
    // }
  },
  // 选择充电接口类型
  interClick(e) {
    console.log(e.currentTarget.id);
    this.setData({
      interfaceType: e.currentTarget.id
    });
  },
  // 选择快充
  fastClick(e) {
    this.setData({
      fastNum: 1,
      slowNum: 0
    });
  },
  // 选择慢充
  slowClick(e) {
    this.setData({
      fastNum: 0,
      slowNum: 1
    });
  },
  // 选择地理位置
  choseLocation() {
    const that = this;
    wx.chooseLocation({
      success: function(res) {
        console.log(res);
        let address = '';
        let location = '';
        let city = '',
          province = '';
        if (res.address == res.name) {
          address = res.address;
          location = res.address;
        } else {
          address = res.address + res.name;
          location = res.address + res.name;
        }
        if (address.match('省') && address.match('市')) {
          province = address.substr(address.indexOf('省') - 2, 2) + '省';
          city = address.substr(address.indexOf('市') - 2, 2) + '市';
        } else {
          if (address.match('市')) {
            province = address.substr(address.indexOf('市') - 2, 2) + '市';
            city = address.substr(address.indexOf('市') - 2, 2) + '市';
          }
        }
        console.log(province, city);
        that.setData({
          location: location,
          latitude: res.latitude,
          longitude: res.longitude,
          province: province,
          city: city
        });
        // var latitude = res.latitude
        // var longitude = res.longitude
        // var speed = res.speed
        // var accuracy = res.accuracy
      }
    });
  },
  // 输入名称
  nameClick(e) {
    console.log(e.detail.value);
    this.setData({
      chargeName: e.detail.value
    });
  },
  // 输入停车费
  parkClick(e) {
    console.log(e.detail.value);
    this.setData({
      parkExpense: e.detail.value
    });
  },
  // 输入电费
  charClick(e) {
    console.log(e.detail.value);
    this.setData({
      elecPrice: e.detail.value
    });
  },
  // 输入服务费
  servClick(e) {
    console.log(e.detail.value);
    this.setData({
      servPrice: e.detail.value
    });
  },
  // 输入服务费
  phoneClick(e) {
    console.log(e.detail.value);
    this.setData({
      phone: e.detail.value
    });
  },
  saveOrUpdateCharge() {
    const that = this;
    if (!that.data.interfaceType) {
      wx.showToast({
        title: '请选择充电接口',
        icon: 'loading',
        duration: 1200
      });
      return;
    }
    if (!that.data.fastNum && !that.data.slowNum) {
      wx.showToast({
        title: '请选择充电速度',
        icon: 'loading',
        duration: 1200
      });
      return;
    }
    if (!that.data.chargeName) {
      wx.showToast({
        title: '名称不能为空',
        icon: 'loading',
        duration: 1200
      });
      return;
    }
    if (that.data.location === '点击选择我的位置') {
      wx.showToast({
        title: '位置不能为空',
        icon: 'loading',
        duration: 1200
      });
      return;
    }
    if (that.data.parkExpense === '') {
      wx.showToast({
        title: '请输入停车费',
        icon: 'loading',
        duration: 1200
      });
      return;
    }
    if (that.data.elecPrice === '') {
      wx.showToast({
        title: '请输入电费',
        icon: 'loading',
        duration: 1200
      });
      return;
    }
    if (that.data.servPrice === '') {
      wx.showToast({
        title: '请输入服务费',
        icon: 'loading',
        duration: 1200
      });
      return;
    }
    if (!that.data.phone) {
      wx.showToast({
        title: '请输入联系电话',
        icon: 'loading',
        duration: 1200
      });
      return;
    }
    if (!that.data.upLoadImgArr.length) {
      wx.showToast({
        title: '请上传电桩照',
        icon: 'loading',
        duration: 1200
      });
      return;
    }
    let publicParams = {
      token: app.data.token, // 登录凭证
      flag: that.data.flag, // 1：添加，2：修改
      chargeId: that.data.chargeId, // 充电桩ID
      city: that.data.city, // 城市
      province: that.data.province, // 省份
      location: that.data.location, // 省份
      latitude: that.data.latitude, // 纬度
      longitude: that.data.longitude, // 经度
      isPublic: 2, // 传2：个人电站
      openTime: that.data.timestar + '-' + that.data.timeend, // 	运营时间，格式：00:00-24:00
      chargeName: that.data.chargeName, // 充电桩名称
      servPrice: that.data.servPrice, // 	服务费（小时/元，或者次/元）
      parkExpense: that.data.parkExpense, // 	停车费（小时/元）
      elecPrice: that.data.elecPrice, // 	电费（小时/元，或者分时间段而定）
      fastNum: that.data.fastNum, // 直流快充，此参数传1
      slowNum: that.data.slowNum, // 交流慢充，此参数传1
      interfaceType: that.data.interfaceType * 1, // 充电接口类型，1：国标接口，2：特斯拉
      phone: that.data.phone, // 手机号
      imgUrl: that.data.upLoadImgArr.join() || '' // 图片url字符集，多个url用逗号隔开
    };
    wx.showLoading({
      title: '加载中'
    });
    let params = {}; // 请求参数
    Object.keys(publicParams).forEach(key => {
      if (publicParams[key] !== '') {
        params[key] = publicParams[key];
      }
    });
    console.log(params);
    app.http.req('/chargeSites/saveOrUpdateCharge', params, res => {
      if (res.data.status === 200) {
        that.resetParams();
        wx.navigateBack();
      }
      wx.hideLoading();
    });
  },
  // 重置参数
  resetParams() {
    this.setData({
      city: '', // 城市
      province: '', // 省份
      location: '', // 地址
      latitude: '', // 纬度
      longitude: '', // 经度
      timestar: '00:00',
      timeend: '23:59',
      openTime: '', // 	运营时间，格式：00:00-24:00
      chargeName: '', // 充电桩名称
      servPrice: '', // 	服务费（小时/元，或者次/元）
      parkExpense: '', // 	停车费（小时/元）
      elecPrice: '', // 	电费（小时/元，或者分时间段而定）
      fastNum: '', // 直流快充，此参数传1
      slowNum: '', // 交流慢充，此参数传1
      interfaceType: '', // 充电接口类型，1：国标接口，2：特斯拉
      phone: '', // 手机号
      imgUrl: '', // 图片url字符集，多个url用逗号隔开
      imgsArr: [],
      imglist: [],
      showlist: [], // 展示的图片数组
      isaddImgShow: true,
      upLoadImgArr: [], // 图片数组
      nameValue: '', // 名称
      parkValue: '', // 停车费
      charValue: '', // 充电费
      servValue: '', // 服务费
      phoneValue: '', // 电话
      isChecked: false
    });
  },
  getChargeSitesInfo(chargeId) {
    const that = this;
    wx.showLoading({
      title: '加载中'
    });
    // 设置添加电桩方式为修改
    that.setData({
      flag: 2, // 1：添加，2：修改
      chargeId: chargeId // 充电桩ID
    });
    app.http.req(
      '/chargeSites/getChargeSitesInfo',
      {
        token: app.data.token,
        chargeId: chargeId
      },
      res => {
        if (res.data.status === 200) {
          const result = res.data.data;
          that.setData({
            nameValue: result.chargeName, // 名称
            parkValue: result.parkExpense, // 停车费
            charValue: result.elecPrice, // 充电费
            servValue: result.servPrice, // 服务费
            phoneValue: result.phone, // 电话
            upLoadImgArr: result.imgUrl.split(','), // 图片数组
            showlist: result.imgUrl.split(','), // 图片数组
            location: result.location, // 默认的地址
            interfaceType: result.interfaceType, // 充电接口类型
            fastNum: result.fastNum, // 快充
            slowNum: result.slowNum, // 慢充
            latitude: result.latitude, // 纬度
            longitude: result.longitude, // 经度
            chargeName: result.chargeName, // 充电桩名称
            parkExpense: result.parkExpense, // 停车费
            elecPrice: result.elecPrice, // 电费
            servPrice: result.servPrice, // 服务费
            phone: result.phone, // 电话号码
            timestar: result.openTime.split('-')[0],
            timeend: result.openTime.split('-')[1],
            city: result.city, // 城市
            province: result.province, // 省份
            isChecked: false // 同意
          });
        }
        wx.hideLoading();
      }
    );
  }
});
