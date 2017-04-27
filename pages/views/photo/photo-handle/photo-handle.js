var httpClient = require('../../../../utils/httpClient.js');
var util = require('../../../../utils/util.js');

var app = getApp();

Page({
    data: {
        'type': '', //  照片类型
        'photoPath': '', // 图片path地址
        'description': '', // 照片描述
        'clipping': '', // 裁剪方式
        'typesetting': '', // 排版
        'amount': '', // 打印数量
        'remark': '' // 备注信息
    },

    onLoad: function (option) {
        var that = this;
        that.setData({
            'type': option.type,
            'photoPath': option.photoPath
        });
    },

    /**
     * 选择需要上传图片
     */
    selectPhoto: function (event) {
        var that = this;
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (response) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                console.log(response);
                that.setData({
                    'photoPath': response.tempFilePaths[0]
                });
            }
        });
    },

    /**
     * 上传选中的图片信息到服务器
     */
    savePrintPhotoInfo: function () {
        var that = this;
        var url = '/shops/photo/upload';
        var param = [];
        var filePath = that.photoPath;
        httpClient.uploadFile(url, param, filePath,
            function (response) {

            },
            function (response) {
                console.log(response);
            });
    },

})
