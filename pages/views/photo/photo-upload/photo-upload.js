var httpClient = require('../../../../utils/httpClient.js');
var util = require('../../../../utils/util.js');

var app = getApp();

Page({
    data: {
        'configuration': [] //  照片类型
    },

    onLoad: function () {
        var that = this;
        var url = "shops/photo/type";
        httpClient.request(url, {}, "GET",
            function (response) {
                var len = response.length;
                for (var i = 0; i < len; i++) {
                    response[i]['color'] = 'icon-wrap-color-' + response[i].code;
                }
                that.setData({
                    configuration: response
                });
            },
            function (response) {
                console.log(response);
            });
    },

    /**
     * 选择上传图片类型
     */
    selectPhotoType: function (event) {
        var code = event.currentTarget.dataset.photoCode;
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (response) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                console.log(response);

                var path = "../photo-handle/photo-handle?type=" + code +
                    "&photoPath=" + response.tempFilePaths[0];
                wx.redirectTo({ url: path });


                // var tempFilePaths = response.tempFilePaths;
                // wx.previewImage({
                //     current: tempFilePaths[0], // 当前显示图片的http链接
                //     urls: tempFilePaths // 需要预览的图片http链接列表
                // });
            }
        });
    },

    /**
     * 选择以前在选定店铺下面的上传过的照片进行下单打印
     */
    selectHistoryPhoto: function () {
        var path = "../photo-order/photo-order";
        wx.redirectTo({ url: path });
    }
})
