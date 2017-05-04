var httpClient = require('../../utils/httpClient.js');
var util = require('../../utils/util.js');

//获取应用实例
var app = getApp();

Page({
  data: {
    shops: [],
    pageNum: 1,
    pageSize: app.globalParam.pageSize,
    searchLoadingComplete: false  // “没有数据”的变量，默认false
  },

  // 监听页面加载
  onLoad: function () {
    var that = this;
    /**
     * 调用自己的应用处理用户信息
     */
    app.getUserInfo(function (param) {
      // 向自己应用处理用户信息
      httpClient.request("login", param, "POST",
        function (response) {
          // 缓存token
          wx.setStorage({
            key: "token",
            data: response.token
          });
          // 将用户id存入缓存
          wx.setStorageSync("memberId", response.id);
        });
    });
  },

  // 监听页面初次渲染完成
  onReady: function () {
    // 获取店铺数据
    this.getShopsInfo();
  },

  /**
   * 获取店铺信息
   */
  getShopsInfo: function () {
    var that = this;
    var shops = that.data.shops;
    var url = "shops?pageNum=" + that.data.pageNum + "&pageSize=" + that.data.pageSize;
    httpClient.request(url, {}, "GET",
      function (response) {
        // that.data['shops'] = response; // 这样修改不能使数据生效，只能通过setData方法修改数据
        var result = response.result;
        var pageSize = response.pageSize;
        var pageNum = response.pageNum;
        if (null == result || result.length == 0) {
          that.setData({
            searchLoadingComplete: true
          });
        } else {
          var len = result.length;
          for (var i = 0; i < len; i++) {
            shops.push(result[i]);
          }
          that.setData({
            shops: shops,
            pageSize: pageSize,
            pageNum: pageNum,
            searchLoadingComplete: false
          });
          if (len < app.globalParam.pageSize) {
            that.setData({
              searchLoadingComplete: true
            });
          }
        }
      });
  },

  /**
   * 下拉刷新回调接口
   */
  onPullDownRefresh: function () {
    console.log("下拉刷新。。。。");
    let that = this;
    that.setData({
      shops: [],
      pageNum: 1, // 初始化查询第一页数据
      searchLoadingComplete: false
    });
    that.getShopsInfo();
    // 小程序提供的api，通知页面停止下拉刷新效果
    wx.stopPullDownRefresh;
  },

  /**
   * 上拉加载回调接口
   */
  onReachBottom: function () {
    console.log("上拉刷新。。。。");
    let that = this;
    if (!that.data.searchLoadingComplete) {
      that.setData({
        pageNum: that.data.pageNum + 1, //每次触发上拉事件，把pageNum+1
      });
      that.getShopsInfo();
    }
  },

  /**
   * 点击店铺进去店铺界面
   */
  clickShop: function (event) {
    var shopId = event.currentTarget.dataset.shopId;
    app.globalParam.shopId = shopId;
    wx.redirectTo({
      url: "../views/photo/photo-upload/photo-upload"
    });
  }
})
