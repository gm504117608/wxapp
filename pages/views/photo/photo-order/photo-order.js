var httpClient = require('../../../../utils/httpClient.js');
var util = require('../../../../utils/util.js');

var app = getApp();

Page({
    data: {
        'printPhoto': [], // 打印照片信息
        'pageNum': 1,
        'pageSize': app.globalParam.pageSize,
        'searchLoadingComplete': false,  // “没有数据”的变量，默认false，隐藏 
        'isClickOrder': false // 是否点击下单按钮
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
     * 选择上传照片进行修改
     */
    clickPrintPhoto: function (event) {
        var id = event.currentTarget.dataset.printPhotoId;
        var that = this;
        if (that.data.isClickOrder) { // 选择需要下单记录
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
        } else { // 修改上传照片信息
            var path = "../photo-handle/photo-handle?id=" + id;
            wx.redirectTo({ url: path });
        }
    },

    /**
     * 选择需要下单的记录
     */
    selectOrderRecords: function () {
        var that = this;
        that.setData({ 'isClickOrder': true });
    },

    /**
     * 取消选择记录下单
     */
    cancelOrderRecords: function () {
        var that = this;
        var printPhoto = that.data.printPhoto;
        var len = printPhoto.length;
        for (var i = 0; i < len; i++) {
            printPhoto[i]['select'] = '';
        }
        that.setData({ 'printPhoto': printPhoto, 'isClickOrder': false });
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
            util.showLoading("亲，麻烦你选择一下需要打印的照片记录！");
            return;
        }
        // 保存订单信息
        var url = "orders";
        var param = {
            'shopId': app.globalParam.shopId,
            'memberId': wx.getStorageSync('memberId'),
            'printPhotographIds': id.substring(1)
        };
        httpClient.request(url, param, "POST",
            function (response) {
                var path = "../photo-payment/photo-payment?id=" + id.substring(1) + "&orderNo=" + response;
                wx.redirectTo({ url: path });
            });
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
    }
})
