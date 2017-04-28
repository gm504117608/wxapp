var httpClient = require('../../../../utils/httpClient.js');
var util = require('../../../../utils/util.js');

var app = getApp();

Page({
    data: {
        'printPhoto': [], // 打印照片信息
        'isClickOrder': false // 是否点击下单按钮
    },

    onLoad: function () {
        var that = this;
        var url = "/shops/photos/" + app.globalParam.shopId + "/" + wx.getStorageSync('memberId');
        httpClient.request(url, {}, "GET",
            function (response) {
                if (util.isNotNull(response)) {
                    var len = response.length;
                    for (var i = 0; i < len; i++) {
                        response[i]['storeUrl'] = app.globalParam.serverUrl + response[i].storeUrl;
                        response[i]['select'] = '';
                    }
                }
                that.setData({
                    'printPhoto': response
                });
            },
            function (response) {
                console.log(response);
            });
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
            that.setData({'printPhoto': printPhoto});
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
    }
})
