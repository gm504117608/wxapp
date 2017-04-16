//index.js
var httpClient = require('../../utils/httpClient.js');
//获取应用实例
var app = getApp();
Page({
  data: {
    flag : ""
  },
  //事件处理函数
  selectPrintPicture1: function () {
    this.data.flag = 1;
    this.selectPrintPicture();
  },
  selectPrintPicture2: function () {
    this.data.flag = 2;    
    this.selectPrintPicture();
  },
  selectPrintPicture3: function () {
    this.data.flag = 3;    
    this.selectPrintPicture();
  },
  selectPrintPicture4: function () {
    this.data.flag = 4;    
    this.selectPrintPicture();
  },
  selectPrintPicture: function () {
    wx.chooseImage({
      count: 5, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log(res);
        var tempFilePaths = res.tempFilePaths;
        wx.previewImage({
          current: tempFilePaths[0], // 当前显示图片的http链接
          urls: tempFilePaths // 需要预览的图片http链接列表
        })
      }
    })
  },
  onLoad: function () {
    var that = this;
    console.log('onLoad');
    var param = {};
    //调用登录接口
    wx.login({
      success: function (data) {
        console.log(data);
        param["code"] = data.code;
        wx.getUserInfo({
          success: function (res) {
            console.log(res);
            param["avatarUrl"] = res.userInfo.avatarUrl;
            param["city"] = res.userInfo.city;
            param["country"] = res.userInfo.country;
            param["gender"] = res.userInfo.gender;
            param["nickName"] = res.userInfo.nickName;
            param["province"] = res.userInfo.province;
            httpClient.request("login", param, "POST",
              function (data) {
                console.log("成功调用");
                console.log(data);
                wx.setStorage({
                  key: "token",
                  data: data.data.data
                });
              },
              function (data) {
                console.log("失败调用");
                console.log(data);
              });
            app.globalData.userInfo = res.userInfo;
            //更新数据
            that.setData({
              userInfo: res.userInfo
            });
          }
        })
      }
    })
  }
})
