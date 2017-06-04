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

  paymentOrder: function (event) {
    var orderNo = event.currentTarget.dataset.orderNo;
    var url = "/orders/" + orderNo;    
    httpClient.request(url, {}, "GET",
      function (response) {
        that.setData({ detail: response });
      }
    );
  },

});
