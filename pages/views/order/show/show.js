var Zan = require('../../../dist/index');
var httpClient = require('../../../../utils/httpClient.js');
var util = require('../../../../utils/util.js');

var app = getApp();

Page(Object.assign({}, Zan.Tab, {
    data: {
        reservationsAll: {
            reservations: [],
            pageNum: 1,
            pageSize: app.globalParam.pageSize,
            searchLoadingComplete: false,  // “没有数据”的变量，默认false，隐藏 
        },
        reservationsS01: {
            reservations: [],
            pageNum: 1,
            pageSize: app.globalParam.pageSize,
            searchLoadingComplete: false,  // “没有数据”的变量，默认false，隐藏 
        },
        reservationsS02: {
            reservations: [],
            pageNum: 1,
            pageSize: app.globalParam.pageSize,
            searchLoadingComplete: false,  // “没有数据”的变量，默认false，隐藏 
        },
        reservationsS03: {
            reservations: [],
            pageNum: 1,
            pageSize: app.globalParam.pageSize,
            searchLoadingComplete: false,  // “没有数据”的变量，默认false，隐藏 
        },
        reservationsS04: {
            reservations: [],
            pageNum: 1,
            pageSize: app.globalParam.pageSize,
            searchLoadingComplete: false,  // “没有数据”的变量，默认false，隐藏 
        },
        reservationsS05: {
            reservations: [],
            pageNum: 1,
            pageSize: app.globalParam.pageSize,
            searchLoadingComplete: false,  // “没有数据”的变量，默认false，隐藏 
        },
        orderTab: {
            list: [{
                id: 'All',
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
            selectedId: 'All',
            scroll: false
        }
    },

    onLoad: function () {
        this.getReservationsInfo('All');
    },

    /**
     * 点击tab页面的触发事件
     */
    handleZanTabChange: function (e) {
        var componentId = e.componentId;
        var selectedId = e.selectedId;
        // 点击tab的时候设置该tab下面的信息
        var reservationsName = "reservations" + selectedId;
        this.setData({
            [`${reservationsName}.reservations`]: [],
            [`${reservationsName}.pageSize`]: app.globalParam.pageSize,
            [`${reservationsName}.pageNum`]: 1,
            [`${reservationsName}.searchLoadingComplete`]: false
        });
        this.getReservationsInfo(selectedId);
    },

    /**
     * 根据不同的订单状态获取订单数据
     * @param status 订单状态
     */
    getReservationsInfo: function (status) {
        var that = this;
        var reservationsName = "reservations" + status;
        if (status == "All") {
            status = "";
        }
        var pageNum = that.data[reservationsName].pageNum;
        var pageSize = that.data[reservationsName].pageSize;
        var url = "/orders?memberId=" + wx.getStorageSync('memberId') + "&status=" + status +
            "&pageNum=" + pageNum + "&pageSize=" + pageSize;
        httpClient.request(url, {}, "GET",
            function (response) {
                if (util.isNull(status)) {
                    status = "All";
                }
                var result = response.result;
                var pageSize = response.pageSize;
                var pageNum = response.pageNum;
                if (null == result || result.length == 0) {
                    that.setData({
                        [`orderTab.selectedId`]: status,
                        [`${reservationsName}.searchLoadingComplete`]: true
                    });
                } else {
                    var reservations = that.data[reservationsName].reservations;
                    var len = result.length;
                    for (var i = 0; i < len; i++) {
                        reservations.push(result[i]);
                    }
                    that.setData({
                        [`${reservationsName}.reservations`]: reservations,
                        [`orderTab.selectedId`]: status,
                        [`${reservationsName}.pageSize`]: pageSize,
                        [`${reservationsName}.pageNum`]: pageNum,
                        [`${reservationsName}.searchLoadingComplete`]: false
                    });
                    if (len < app.globalParam.pageSize) {
                        that.setData({
                            [`${reservationsName}.searchLoadingComplete`]: true
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
        var selectedId = that.data.orderTab.selectedId;
        var reservationsName = "reservations" + selectedId;
        that.setData({
            [`${reservationsName}.reservations`]: [],
            [`${reservationsName}.pageNum`]: 1, // 初始化查询第一页数据
            [`${reservationsName}.searchLoadingComplete`]: false
        });
        that.getReservationsInfo(selectedId);
        // 小程序提供的api，通知页面停止下拉刷新效果
        wx.stopPullDownRefresh;
    },

    /**
     * 上拉加载回调接口
     */
    onReachBottom: function () {
        console.log("上拉刷新。。。。");
        let that = this;
        var selectedId = that.data.orderTab.selectedId;
        var reservationsName = "reservations" + selectedId;
        if (!that.data[reservationsName].searchLoadingComplete) {
            that.setData({
                [`${reservationsName}.pageNum`]: that.data[reservationsName].pageNum + 1, //每次触发上拉事件，把pageNum+1
            });
            that.getReservationsInfo(selectedId);
        }
    },

    /**
     * 支付订单
     */
    paymentOrder: function (event) {
        var orderNo = event.currentTarget.dataset.orderNo;
        var path = "../../order/payment?orderNo=" + orderNo;
        wx.redirectTo({ url: path });
    },


    /**
     * 显示订单详情
     */
    viewReservationDetail: function (event) {
        var orderNo = event.currentTarget.dataset.orderNo;
        var path = "../details/details?orderNo=" + orderNo;
        wx.redirectTo({ url: path });
    }
}));
