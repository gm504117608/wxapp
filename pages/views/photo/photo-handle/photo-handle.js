var httpClient = require('../../../../utils/httpClient.js');
var util = require('../../../../utils/util.js');

var app = getApp();

Page({
    data: {
        'id': '',// 唯一标示ID
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

    blurClipping: function (e) {
        var value = e.detail.value;
        this.setData({ 'clipping': value });
    },

    blurTypesetting: function (e) {
        var value = e.detail.value;
        this.setData({ 'typesetting': value });
    },

    blurAmount: function (e) {
        var value = e.detail.value;
        this.setData({ 'amount': value });
    },


    blurDescription: function (e) {
        var value = e.detail.value;
        this.setData({ 'description': value });
    },

    blurRemark: function (e) {
        var value = e.detail.value;
        this.setData({ 'remark': value });
    },

    /**
     * 上传选中的图片信息到服务器
     */
    savePrintPhotoInfo: function () {
console.log(app.globalParam);

        var that = this;
        var url = '/shops/photo/upload';
        var param = {
            'id': that.data.id,
            'memberId': wx.getStorageSync('memberId'),
            'shopId': app.globalParam.shopId,
            'description': that.data.description,
            'type': that.data.type,
            'clipping': that.data.clipping,
            'typesetting': that.data.typesetting,
            'amount': that.data.amount,
            'remark': that.data.remark
        };
        var filePath = that.data.photoPath;
        httpClient.uploadFile(url, param, filePath,
            function (response) {
                console.log(response);
            },
            function (response) {
                console.log(response);
            });
    },

})
