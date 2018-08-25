// pages/carfans/pages/carfansdetail/carfansdetail.js
var app = getApp();
Page({
  data: {
    myOpenid: "",
    imglist: [],
    showlist: [], // 展示的图片数组
    isaddImgShow: true,
    upLoadImgArr: [], // 图片数组
    // titleValue: "", // 标题内容
    bbsContent: "", // 详细内容
    searchModelName: "", // 选择的模版名称
    searchModelId: 0, // 选择的模版ID
    // // // // // // // //
    telPhone: "" // 我的手机号
  },
  onLoad: function(options) {
    // 生命周期函数--监听页面加载
  },
  // 获取标题的内容
  // bindTitleInput: function(e) {
  //   var that = this;
  //   that.setData({
  //     titleValue: e.detail.value
  //   });
  //   console.log(that.data.titleValue);
  // },
  // 获取详细的内容
  bindContentInput: function(e) {
    var that = this;
    that.setData({
      bbsContent: e.detail.value
    });
    console.log(that.data.bbsContent);
  },
  // 选择图片
  choseImgs() {
    const that = this;
    var num = 0;
    // 选择照片
    wx.chooseImage({
      count: 9, // 最多可以选择的图片张数，默认9
      sizeType: ["original", "compressed"], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ["album", "camera"], // album 从相册选图，camera 使用相机，默认二者都有
      success: function(res) {
        var tempFilePaths = res.tempFilePaths;
        // console.log(tempFilePaths);
        for (var i in res.tempFilePaths) {
          if (that.data.imglist.length < 8) {
            that.data.imglist.push(res.tempFilePaths[i]);
            console.log(that.data.imglist);
            console.log(that.data.imglist.length);
            // 将图片上传到阿里云
            wx.uploadFile({
              url: "https://chong.rbson.net/dev/oss/uploadImgs",
              filePath: tempFilePaths[i],
              name: "imgs",
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
            wx.showModal({
              title: "警告",
              content: "图片上传到达上限",
              success: function(res) {
                if (res.confirm) {
                  console.log(res);
                  console.log(res.userInfo);
                  console.log("用户点击确定");
                  console.log(that.data.imglist);
                }
              }
            });
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
  // 发布
  publishInfo() {
    var that = this;
    // 判断
    // if (!that.data.titleValue) {
    //   wx.showToast({
    //     title: "标题不能为空",
    //     icon: "loading",
    //     mask: true,
    //     duration: 1200
    //   });
    //   return;
    // }
    if (!that.data.bbsContent) {
      wx.showToast({
        title: "内容不能为空",
        icon: "loading",
        mask: true,
        duration: 1200
      });
      return;
    }
    if (!that.data.upLoadImgArr.length) {
      wx.showToast({
        title: "图片不能为空",
        icon: "loading",
        mask: true,
        duration: 1200
      });
      return;
    }
    that.addBbs();
  },
  // 添加论坛
  addBbs() {
    const that = this;
    let publicParams = {
      token: app.data.token, // 登录凭证
      bbsContent: that.data.bbsContent, // 1：车友会，2：桩友会
      bbsImg: that.data.upLoadImgArr.join(), // 开始页面
      bbsType: 1
    };
    let params = {}; // 请求参数
    Object.keys(publicParams).forEach(key => {
      if (publicParams[key] !== "") {
        params[key] = publicParams[key];
      }
    });
    console.log(params);
    app.http.req("/bbs/addBbs", params, res => {
      console.log(res);
      if (res.data.status === 200) {
        wx.showToast({
          title: "成功",
          icon: "success",
          duration: 1500
        });
        wx.setStorageSync("isShow", true);
        setTimeout(() => {
          wx.switchTab({
            url: "/pages/carfans/carfans"
          });
        }, 1600);
      }
    });
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
