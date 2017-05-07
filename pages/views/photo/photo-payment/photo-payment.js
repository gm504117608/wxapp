var httpClient = require('../../../../utils/httpClient.js');
var util = require('../../../../utils/util.js');
var Zan = require('../../../dist/index');

var app = getApp();

Page(Object.assign({}, Zan.Quantity, Zan.Toast, {
    data: {
        'orderNo': '',
        'printPhoto': [], // 打印照片信息
        'cost': 0, // 需要支付的金额
        'consignmentAddress': {}, // 收件人地址
        'dispatchingWays': [], // 配送方式
        'dispatchingWay': '' // 选择的配送方式
    },

    onLoad: function (option) {
        var that = this;
        that.setData({ 'orderNo': option.orderNo });
        var url = "/shops/payment/" + option.id;
        httpClient.request(url, {}, "GET",
            function (response) {
                that.setData({
                    'consignmentAddress': response.consigneeAddress,
                    'dispatchingWays': response.dispatchingWays
                });
                var printPhoto = response.printPhoto;
                var cost = 0;
                if (util.isNotNull(printPhoto)) {
                    var len = printPhoto.length;
                    for (var i = 0; i < len; i++) {
                        printPhoto[i]['amount' + printPhoto[i].id] = { quantity: 1, min: 1, max: 50 };
                        cost = cost + printPhoto[i]['price'];
                        printPhoto[i]['storeUrl'] = app.globalParam.serverUrl + printPhoto[i].storeUrl;
                    }
                }
                cost = util.fillUpMoneyTwoDecimals(cost);
                that.setData({
                    'printPhoto': printPhoto,
                    'cost': cost,
                });
            });
    },

    /**
     * 控制数量加减器
     */
    handleZanQuantityChange(e) {
        var componentId = e.componentId;
        var quantity = e.quantity;
        var printPhoto = this.data.printPhoto;
        var cost = 0;
        var len = printPhoto.length;
        var id = componentId.substring(6);
        for (var i = 0; i < len; i++) {
            if (printPhoto[i].id == id) {
                printPhoto[i][componentId].quantity = quantity;
            }
            cost = cost + (printPhoto[i]['amount' + printPhoto[i].id].quantity * printPhoto[i]['price']);
        }
        cost = util.fillUpMoneyTwoDecimals(cost);
        this.setData({
            'printPhoto': printPhoto,
            'cost': cost
        });
    },

    /**
     * 修改收件人地址
     */
    editConsignmentAddress: function () {
        var that = this;
        // 获取收货地址数据
        var param = {};
        var url = "consignment/members/" + wx.getStorageSync('memberId');
        httpClient.request(url, param, "GET",
            function (response) {
                var len = response.length;
                var address = {};
                for (var i = 0; i < len; i++) {
                    if (response[i].isUsing == 1) {
                        address = response[i];
                    }
                }
                that.setData({ consignmentAddress: address });
            });
    },

    /**
     * 修改配送方式
     */
    dispatchingWayChange: function (event) {
        console.log(event);
        var that = this;
        var value = event.detail.value;
        that.setData({ 'dispatchingWay': value });
    },

    /**
     * 支付订单
     */
    paymentOrder: function () {
        var that = this;
        var printPhoto = that.data.printPhoto;
        if (util.isNull(printPhoto)) {
            that.showToast('无打印照片信息');
            return;
        }
        var consignmentAddress = that.data.consignmentAddress;
        if (util.isNull(consignmentAddress)) {
            that.showToast('请选择收货地址');
            return;
        }
        var dispatchingWay = that.data.dispatchingWay;
        if (util.isNull(dispatchingWay)) {
            that.showToast('请选择配送方式');
            return;
        }
        var ids = '';
        var amounts = '';
        var len = printPhoto.length;
        for (var i = 0; i < len; i++) {
            ids = ',' + printPhoto[i].id + ids;
            amounts = ',' + printPhoto[i]['amount' + printPhoto[i].id].quantity + amounts;
        }
        var param = {
            'cost': that.data.cost,
            'orderNo': that.data.orderNo,
            'ids': ids.substring(1),
            'amounts': amounts.substring(1),
            'consignmentId': consignmentAddress.id,
            'dispatchingWay': dispatchingWay
        };
        var url = "/orders/payment";
        httpClient.request(url, param, "POST",
            function (response) {
                var path = "../../order/payment";
                wx.redirectTo({ url: path });
            });
    },

    showToast: function (title) {
        this.showZanToast(title);
    }
}));
