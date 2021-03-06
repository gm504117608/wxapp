var httpClient = require('../../../utils/httpClient.js');
var util = require('../../../utils/util.js');
var Zan = require('../../dist/index');

var app = getApp();

Page(Object.assign({}, Zan.Toast, {
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
                var len = response.length;
                for (var i = 0; i < len; i++) {
                    response[i]['select'] = '';
                }
                that.setData({
                    configuration: response
                });
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
        var configuration = this.data.configuration;
        var len = configuration.length;
        for (var i = 0; i < len; i++) {
            if (configuration[i].code === code) {
                configuration[i].select = 'icon-wrap-select';
            } else {
                configuration[i].select = '';
            }
        }
        this.setData({ 'type': code, 'configuration': configuration });

    },

    /**
     * 保存反馈信息
     */
    saveFeedbackInfo: function () {
        var that = this;
        if (util.isNull(that.data.type)) {
            that.showToast("反馈类型不能为空");
            return;
        }
        if (util.isNull(that.data.mobile)) {
            that.showToast("手机号码不能为空");
            return;
        }
        if (!util.checkPhoneNumber(that.data.mobile)) {
            that.showToast("联系方式格式填写不正确");
            return;
        }
        if (util.isNull(that.data.content)) {
            that.showToast("反馈内容不能为空");
            return;
        }
        var param = {
            "memberId": wx.getStorageSync('memberId'),// 会员唯一标识id
            "mobile": that.data.mobile,
            "type": that.data.type,
            "content": that.data.content
        };
        httpClient.request("feedback/", param, "POST",
            function (response) {
                // 返回上一界面
                wx.switchTab({
                    url: "../myself/myself-index"
                });
            });
    },

    showToast: function (title) {
        this.showZanToast(title);
    }
}));
