var Zan = require('../../dist/index.js');
//获取应用实例
var app = getApp();

Page(Object.assign({}, Zan.Switch, {
  data: {
    checked: false,
    userInfo: []
  },

  onLoad() {
    this.setData({
      userInfo: app.globalParam.userInfo
    });
  },

  onShow() {
  },

  handleZanSwitchChange(e) {
    this.setData({
      checked: e.checked
    });
  },

  /**
   * 关于我们
   */
  aboutUs: function () {
    wx.redirectTo({
      url: "../about-us/about-us"
    });
  },

  /**
   * 收货地址
   */
  consignmentAddress: function () {
    wx.redirectTo({
      url: "../consignee-address/show/show"
    });
  },

  /**
   * 会员信息
   */
  memberInfo: function () {
    wx.redirectTo({
      url: "../user-info/user-info"
    });
  },

  /**
   * 系统消息
   */
  systemInfo: function () {
    wx.redirectTo({
      url: "../system/system-info"
    });
  },

  /**
   * 用户反馈
   */
  userFeedback: function () {
    wx.redirectTo({
      url: "../feedback/feedback-info"
    });
  },

  /**
   * 我的订单
   */
  myOrder: function () {
    wx.redirectTo({
      url: "../order/show/show"
    });
  },

}));
