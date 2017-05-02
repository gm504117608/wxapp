var Zan = require('../../../dist/index');
var httpClient = require('../../../../utils/httpClient.js');
var util = require('../../../../utils/util.js');

var app = getApp();

Page(Object.assign({}, Zan.Tab, {
    data: {
        reservations: [],
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
            scroll: true
        }
    },

    onLoad: function () {
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
        var url = "/orders?memberId=" + wx.getStorageSync('memberId') + "&status=" + status;
        httpClient.request(url, {}, "GET",
            function (response) {
                if (util.isNull(status)) {
                    status = "all";
                }
                var reservations = [];
                for (var i = 0, len = response.length; i < len; i++) {
                    reservations.push(response[i]);
                }
                that.setData({
                    'reservations': reservations,
                    [`orderTab.selectedId`]: status
                });
            },
            function (response) {
                console.log(response);
            });
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
