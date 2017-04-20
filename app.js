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
            // 设置全局用户信息数据
            that.globalParam.userInfo = response.userInfo;
            that.globalParam.userInfo['code'] = code;
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
    userInfo: null,
    serverUrl: "http://localhost:8080/api/",
    pageSize: 10
  }

})