var httpClient = require('../../../../utils/httpClient.js');
var util = require('../../../../utils/util.js');

var app = getApp();

Page({
  data: {
    detail: [],
    serverUrl: app.globalParam.serverUrl
  },

  onLoad: function (option) {
    var orderNo = option.orderNo; // 订单号
    var that = this;
    var url = "/orders/" + orderNo;
    httpClient.request(url, {}, "GET",
      function (response) {
        that.setData({ detail: response });
      }
    );
  },

  /**
   * 支付订单
   */
  paymentOrder: function (event) {
    var orderNo = event.currentTarget.dataset.orderNo;
    var url = "/payment/" + orderNo;
    httpClient.request(url, {}, "GET",
      function (response) {
        wx.requestPayment({
          'timeStamp': response.timestamp,
          'nonceStr': response.noncestr,
          'package': "prepay_id=" + response.prepayid,
          'signType': 'MD5',
          'paySign': response.sign,
          'success': function (res) {
            // 支付成功成功回到订单详情界面

          },
          'fail': function (res) {
            // 支付失败给出提示

          }
        });
      }
    );
  },

});
