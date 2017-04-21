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
      url: "../about-us/about"
    });
  },

  /**
   * 收货地址
   */
  consignmentAddress: function () {
    wx.redirectTo({
      url: "../consignee-address/consignment-address?id=" + this.userInfo.id
    });
  }
}));
