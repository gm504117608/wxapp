var httpClient = require('../../../../utils/httpClient.js');
var util = require('../../../../utils/util.js');

var app = getApp();

Page({
  data: {
    consignmentAddress: []
  },

  onLoad: function (options) {
    var that = this;
    // 获取收货地址数据
    var param = {};
    var url = "consignment/members/" + wx.getStorageSync('memberId');
    httpClient.request(url, param, "GET",
      function (response) {
        that.setData({ consignmentAddress: response });
      });
  },

  /**
   * 新增收货地址
   */
  createConsignmentAddress: function () {
    wx.redirectTo({
      url: "../details/details"
    });
  },

  /**
   * 修改收货地址
   */
  updateConsignmentAddress: function (event) {
    var id = event.currentTarget.dataset.consignmentAddressId;
    wx.redirectTo({
      url: '../details/details?id=' + id,
    });
  }

})