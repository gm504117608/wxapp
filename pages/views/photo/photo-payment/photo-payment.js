var httpClient = require('../../../../utils/httpClient.js');
var util = require('../../../../utils/util.js');
var Zan = require('../../../dist/index');

var app = getApp();

Page(Object.assign({}, Zan.Quantity, {
    data: {
        'orderNo': '',
        'printPhoto': [], // 打印照片信息
        'cost': 0 // 需要支付的金额

    },

    onLoad: function (option) {
        var that = this;
        that.setData({ 'orderNo': option.orderNo });
        var url = "/shops/payment/" + option.id;
        httpClient.request(url, {}, "GET",
            function (response) {
                var cost = 0;
                if (util.isNotNull(response)) {
                    var len = response.length;
                    for (var i = 0; i < len; i++) {
                        response[i]['amount' + response[i].id] = { quantity: 1, min: 1, max: 50 };
                        cost = cost + response[i]['price'];
                        response[i]['storeUrl'] = app.globalParam.serverUrl + response[i].storeUrl;
                    }
                }
                cost = util.fillUpMoneyTwoDecimals(cost);
                that.setData({
                    'printPhoto': response,
                    'cost': cost
                });
            },
            function (response) {
                console.log(response);
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
     * 支付订单
     */
    paymentOrder: function () {
        var that = this;
        var printPhoto = that.data.printPhoto;
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
            'amounts': amounts.substring(1)
        };
        var url = "/orders/payment";
        httpClient.request(url, param, "POST",
            function (response) {
                var path = "../../order/payment";
                wx.redirectTo({ url: path });
            },
            function (response) {
                console.log(response);
            });
    }
}));
