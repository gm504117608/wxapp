var httpClient = require('../../../../utils/httpClient.js');
var util = require('../../../../utils/util.js');
var Zan = require('../../../dist/index');

var app = getApp();

Page(Object.assign({}, Zan.Toast, {
  data: {
    'printPhoto': [], // 打印照片信息
    'pageNum': 1,
    'pageSize': app.globalParam.pageSize,
    'searchLoadingComplete': false  // “没有数据”的变量，默认false，隐藏 
  },

  onLoad: function () {
    var that = this;
    that.getPrintPhotographInfo();
  },

  /**
 * 下拉刷新回调接口
 */
  onPullDownRefresh: function () {
    console.log("下拉刷新。。。。");
    let that = this;
    that.setData({
      printPhoto: [],
      pageNum: 1, // 初始化查询第一页数据
      searchLoadingComplete: false //把“没有数据”设为true，显示 
    });
    that.getPrintPhotographInfo();
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
      that.getPrintPhotographInfo();
    }
  },

  /**
   * 修改打印照片信息
   */
  editPrintPhoto: function (event) {
    var id = event.currentTarget.dataset.printPhotoId;
    var path = "../photo-handle/photo-handle?id=" + id;
    wx.redirectTo({ url: path });
  },

  /**
   * 删除打印照片信息
   */
  deletePrintPhoto: function (event) {
    var that = this;
    var id = event.currentTarget.dataset.printPhotoId;
    var param = {};
    wx.showModal({
      title: '提示',
      content: '主人，求不离不弃',
      success: function (res) {
        if (res.confirm) {
          httpClient.request("/shops/photo/delete/" + id, param, "POST",
            function (response) {
              // 刷新数据
              that.onPullDownRefresh();
            });
        }
      }
    });
  },

  /**
   * 选择上传照片进行修改
   */
  selectPrintPhoto: function (event) {
    var id = event.currentTarget.dataset.printPhotoId;
    var that = this;
    var printPhoto = that.data.printPhoto;
    var len = printPhoto.length;
    for (var i = 0; i < len; i++) {
      if (printPhoto[i]['id'] === id) {
        if (util.isNotNull(printPhoto[i]['select'])) {
          printPhoto[i]['select'] = '';
        } else {
          printPhoto[i]['select'] = 'zan-card-select';
        }
      }
    }
    that.setData({ 'printPhoto': printPhoto });
  },

  /**
   * 确定选择的记录进行下单操作
   */
  confirmOrderRecords: function () {
    var that = this;
    var printPhoto = that.data.printPhoto;
    var len = printPhoto.length;
    var id = '';
    for (var i = 0; i < len; i++) {
      if (util.isNotNull(printPhoto[i]['select'])) {
        id = ',' + printPhoto[i].id + id;
      }
    }
    if (util.isNull(id)) {
      that.showToast("亲，麻烦你选择一下需要打印的照片记录！");
      return;
    }
    var path = "../photo-payment/photo-payment?id=" + id.substring(1);
    wx.redirectTo({ url: path });
  },

  /**
   * 获取店铺会员上传历史照片信息
   */
  getPrintPhotographInfo: function () {
    var that = this;
    if (that.data.searchLoadingComplete) {
      return;
    }
    var printPhoto = that.data.printPhoto;
    var url = "/shops/photos?shopId=" + app.globalParam.shopId + "&memberId=" + wx.getStorageSync('memberId') +
      "&pageNum=" + that.data.pageNum + "&pageSize=" + that.data.pageSize;;
    httpClient.request(url, {}, "GET",
      function (response) {
        var result = response.result;
        var pageSize = response.pageSize;
        var pageNum = response.pageNum;
        if (null == result || result.length == 0) {
          that.setData({
            searchLoadingComplete: true //把“没有数据”设为true，显示 
          });
        } else {
          var len = result.length;
          for (var i = 0; i < len; i++) {
            result[i]['storeUrl'] = app.globalParam.serverUrl + result[i].storeUrl;
            result[i]['select'] = '';
            printPhoto.push(result[i]);
          }
          that.setData({
            printPhoto: printPhoto,
            pageSize: pageSize,
            pageNum: pageNum,
            searchLoadingComplete: false //把“没有数据”设为true，显示 
          });
          // 获取的数据少于没有的数量表示已经没有数据了
          if (len < app.globalParam.pageSize) {
            that.setData({
              searchLoadingComplete: true //把“没有数据”设为true，显示 
            });
          }
        }
      });
  },

  showToast: function (title) {
    this.showZanToast(title);
  }
}));
