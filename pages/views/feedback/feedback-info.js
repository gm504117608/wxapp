var httpClient = require('../../../utils/httpClient.js');
var util = require('../../../utils/util.js');

var app = getApp();

Page({
    data: {
        'configuration': [], //  反馈类型类型
        'content': '',
        'mobile': '',
        'type': '' // 反馈类型
    },

    onLoad: function () {
        var that = this;
        var url = "feedback/type";
        httpClient.request(url, {}, "GET",
            function (response) {
                that.setData({
                    configuration: response
                });
            },
            function (response) {
                console.log(response);
            });
    },

    /**
     * 手机号码
     */
    blurMobile: function (e) {
        var value = e.detail.value;
        this.setData({ mobile: value });
    },

    /**
     * 反馈内容
     */
    blurContent: function (e) {
        var value = e.detail.value;
        this.setData({ content: value });
    },

    /**
     * 选择反馈类型
     */
    selectFeedbackType: function (event) {
        var code = event.currentTarget.dataset.configurationCode;
        this.setData({ 'type': code });
    },

    /**
     * 保存反馈信息
     */
    saveFeedbackInfo: function () {
        var that = this;
        var param = {
            "memberId": wx.getStorageSync('memberId'),// 会员唯一标识id
            "mobile": that.data.mobile,
            "type": that.data.type,
            "content": that.data.content
        };
        httpClient.request("feedback/", param, "POST",
            function (response) {
                // 返回上一界面
                wx.redirectTo({
                    url: "../user/userCenterIndex"
                });
            },
            function (response) {
                console.log(response);
            });
    },
})
