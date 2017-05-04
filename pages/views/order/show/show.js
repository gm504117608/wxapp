var Zan = require('../../../dist/index');
var httpClient = require('../../../../utils/httpClient.js');
var util = require('../../../../utils/util.js');

var app = getApp();

Page(Object.assign({}, Zan.Tab, {
    data: {
        reservations: [],
        pageNum: 1,
        pageSize: 10,
        searchLoadingComplete: false,  // “没有数据”的变量，默认false，隐藏 
        orderTab: {
            list: [{
                id: 'all',
                title: '全部'
            }, {
                id: 'S01',
                title: '待付款'
            }, {
                id: 'S02',
                title: '待发货'
            }, {
                id: 'S03',
                title: '待收货'
            }, {
                id: 'S04',
                title: '待评论'
            }, {
                id: 'S05',
                title: '已完成'
            }],
            selectedId: 'all',
            scroll: false
        }
    },

    onLoad: function () {
        this.setData({ pageSize: app.globalParam.pageSize });
        this.getReservationsInfo('');
    },

    /**
     * 点击tab页面的触发事件
     */
    handleZanTabChange: function (e) {
        var componentId = e.componentId;
        var selectedId = e.selectedId;
        this.getReservationsInfo(selectedId);
    },

    /**
     * 根据不同的订单状态获取订单数据
     * @param status 订单状态
     */
    getReservationsInfo: function (status) {
        if (status == "all") {
            status = "";
        }
        var that = this;
        //  获取订单数据
        var url = "/orders?memberId=" + wx.getStorageSync('memberId') + "&status=" + status +
            "&pageNum=" + that.data.pageNum + "&pageSize=" + that.data.pageSize;
        httpClient.request(url, {}, "GET",
            function (response) {
                if (util.isNull(status)) {
                    status = "all";
                }
                var result = response.result;
                var pageSize = response.pageSize;
                var pageNum = response.pageNum;
                if (null == result || result.length == 0) {
                    that.setData({
                        [`orderTab.selectedId`]: status,
                        searchLoadingComplete: true
                    });
                } else {
                    var reservations = [];
                    var len = result.length;
                    for (var i = 0; i < len; i++) {
                        reservations.push(result[i]);
                    }
                    that.setData({
                        'reservations': reservations,
                        [`orderTab.selectedId`]: status,
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
            },
            function (response) {
                console.log(response);
            });
    },

    /**
      * 下拉刷新回调接口
      */
    onPullDownRefresh: function () {
        console.log("下拉刷新。。。。");
        let that = this;
        that.setData({
            reservations: [],
            pageNum: 1, // 初始化查询第一页数据
            searchLoadingComplete: false
        });
        that.getReservationsInfo();
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
            that.getReservationsInfo();
        }
    },

    /**
     * 支付订单
     */
    paymentOrder: function (event) {
        var orderNo = event.currentTarget.dataset.orderNo;
        console.log(orderNo);
        var path = "../../order/payment?orderNo" + orderNo;
        wx.redirectTo({ url: path });
    }
}));
