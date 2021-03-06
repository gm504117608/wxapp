//app.js
App({
  onLaunch: function (options) {
    // Do something initial when launch.
  },

  onShow: function (options) {
    // Do something when show.
  },

  onHide: function () {
    // Do something when hide.
  },

  onError: function (msg) {
    console.log(msg)
  },

  /**
   * 获取微信用户信息
   */
  getUserInfo: function (callBack) {
    var that = this;
    //调用登录接口
    wx.login({
      success: function (response) {
        var code = response.code;
        wx.getUserInfo({
          success: function (response) {
            console.log(response);
            // 设置全局用户信息数据
            that.globalParam.userInfo = response.userInfo;
            that.globalParam.userInfo['code'] = code;
            that.globalParam.userInfo['encryptedData'] = response.encryptedData;
            that.globalParam.userInfo['iv'] = response.iv;
            that.globalParam.userInfo['sign'] = response.signature;
            // 回调函数
            callBack(that.globalParam.userInfo);
          }
        })
      },
      fail: function (response) {
        console.log(response);
      }
    })
  },

  globalParam: {
    userInfo: {},
    serverUrl: "http://localhost:8080/api/",
    pageSize: 10,
    shopId: ''
  }

})