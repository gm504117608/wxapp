//index.js
var httpClient = require('../../utils/httpClient.js');
//获取应用实例
var app = getApp();
Page({
  data: {
    motto: 'Hello World',
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
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
