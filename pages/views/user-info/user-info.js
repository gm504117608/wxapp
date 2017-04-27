var httpClient = require('../../../utils/httpClient.js');
var util = require('../../../utils/util.js');

var app = getApp();

Page({
    data: {
        nickName: '',
        avatarUrl: '',
        mobile: '',
        email: '',
        signature: ''
    },

    onLoad: function (options) {
        var that = this;
        var url = "members/" + wx.getStorageSync('memberId');;
        httpClient.request(url, {}, "GET",
            function (response) {
                that.setData({
                    nickName: response.nickName,
                    avatarUrl: response.avatarUrl,
                    mobile: response.mobile,
                    email: response.email,
                    signature: response.signature
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
     * 邮件地址
     */
    blurEmail: function (e) {
        var value = e.detail.value;
        this.setData({ email: value });
    },

    /**
     * 个性签名描述
     */
    blurSignature: function (e) {
        var value = e.detail.value;
        this.setData({ signature: value });
    },

    /**
     * 保存用户信息
     */
    saveUserInfo: function () {
        var that = this;
        var param = {
            "id": wx.getStorageSync('memberId'),// 会员唯一标识id
            "mobile": that.data.mobile,
            "email": that.data.email,
            "signature": that.data.signature
        };
        httpClient.request("members/", param, "POST",
            function (response) {
                // 返回上一界面
                wx.redirectTo({
                    url: "../myself/myself-index"
                });
            },
            function (response) {
                console.log(response);
            });
    }
});