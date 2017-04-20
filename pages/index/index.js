var httpClient = require('../../utils/httpClient.js');
//获取应用实例
var app = getApp();

Page({
  data: {
    shops: null,
    pageNum: 1,
    pageSize: app.globalParam.pageSize,
    searchLoading: false, // "上拉加载"的变量，默认true，隐藏 
    searchLoadingComplete: false  // “没有数据”的变量，默认false，隐藏 
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
            data: response.data.data
          });
        },
        function (response) {
          console.log(response);
        });
    });
  },

  // 监听页面初次渲染完成
  onReady: function () {
    // 获取店铺数据
    this.getShops();
  },

  /**
   * 获取店铺信息
   */
  getShops: function () {
    var that = this;
    var shops = [];
    shops.concat(that.data.shops);
    var url = "shops?pageNum=" + that.data.pageNum + "&pageSize=" + that.data.pageSize;
    httpClient.request(url, {}, "GET",
      function (response) {
        // that.data['shops'] = response.data.data; // 这样修改不能使数据生效，只能通过setData方法修改数据
        var result = response.data.data;
        if (result == null) {
          that.setData({
            searchLoadingComplete: true, //把“没有数据”设为true，显示 
            searchLoading: false  //把"上拉加载"的变量设为false，隐藏 
          });
        } else {
          var shopsInfo = result.result;
          that.setData({
            shops: shops.concat(shopsInfo),
            pageSize: result.pageSize,
            pageNum: result.pageNum,
            searchLoadingComplete: false, //把“没有数据”设为true，显示 
            searchLoading: true   //把"上拉加载"的变量设为false，显示 
          });
        }
      },
      function (response) {
        console.log(response);
      });
  },

  /**
   * 滚动到底部触发事件 
   */ 
  searchScrollLower: function (event) {
    console.log("下拉刷新。。。。");
    console.log(event);
    
    let that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        pageNum: that.data.pageNum + 1, //每次触发上拉事件，把pageNum+1
      });
      that.getShops();
    }
  }
})
