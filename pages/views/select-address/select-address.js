var httpClient = require('../../../utils/httpClient.js');
var util = require('../../../utils/util.js');
var Zan = require('../../dist/index');

var app = getApp();

Page(Object.assign({}, Zan.Switch, {
    data: {
        id: '', // 收货地址唯一标识
        consignmentAddress: {}, // 收货地址信息
        provinceName: [],
        provinceCode: [],
        cityName: [],
        cityCode: [],
        areaName: [],
        areaCode: [],
        selectProvinceCode: '',
        selectCityCode: '',
        selectAreaCode: '',
        provinceIndex: 0,
        cityIndex: 0,
        areaIndex: 0,
        checked: true, // 是否默认收货地址
        name: '',
        mobile: '',
        postcode: '',
        address: ''
    },

    onLoad: function (options) {
        var that = this;
        // 前一界面传入的收货地址唯一标识
        that.setData({ id: options.id });
        // 获取收货地址数据
        var id = that.data.id;
        if (util.isNotNull(id)) {
            var url = "consignment/" + id;
            httpClient.request(url, {}, "GET",
                function (response) {
                    that.setData({ consignmentAddress: response.data.data });
                },
                function (response) {
                    console.log(response);
                });
        }
        // 获取省份数据
        that.getProvinceDatas();
    },

    /**
     * 获取省份数据
     */
    onProvinceChange: function (e) {
        console.log(e);

        var that = this;
        var index = e.detail.value;
        var code = that.data.provinceCode[index];
        that.setData({
            selectProvinceCode: code,
            provinceIndex: index,
            areaName: [],
            areaCode: [],
            selectCityCode: '',
            selectAreaCode: '',
            cityIndex: 0,
            areaIndex: 0
        });
        that.getCityDatas();
    },

    /**
     * 获取城市数据
     */
    onCityChange: function (e) {
        console.log(e);

        var that = this;
        var index = e.detail.value;
        var code = that.data.cityCode[index];
        that.setData({
            selectCityCode: code,
            cityIndex: index,
            selectAreaCode: '',
            areaIndex: 0
        });
        that.getAreaDatas();
    },

    /**
     * 获取行政区数据
     */
    onAreaChange: function (e) {
        console.log(e);

        var that = this;
        var index = e.detail.value;
        var code = that.data.areaCode[index];
        that.setData({
            selectAreaCode: code,
            areaIndex: index
        });

    },

    /**
     * 获取省份数据
     */
    getProvinceDatas: function () {
        var that = this;
        var url = "consignment/province";
        httpClient.request(url, {}, "GET",
            function (response) {
                var province = response.data.data;
                var len = province.length;
                var provinceName = [];
                var provinceCode = [];
                for (var i = 0; i < len; i++) {
                    provinceName.push(province[i].description);
                    provinceCode.push(province[i].code);
                }
                that.setData({
                    provinceName: provinceName,
                    provinceCode: provinceCode
                });
            },
            function (response) {
                console.log(response);
            });
    },

    /**
     * 获取城市数据
     */
    getCityDatas: function () {
        var that = this;
        var url = "consignment/city/" + that.data.selectProvinceCode;
        httpClient.request(url, {}, "GET",
            function (response) {
                var city = response.data.data;
                var len = city.length;
                var cityName = [];
                var cityCode = [];
                for (var i = 0; i < len; i++) {
                    cityName.push(city[i].description);
                    cityCode.push(city[i].code);
                }
                that.setData({
                    cityName: cityName,
                    cityCode: cityCode
                });
            },
            function (response) {
                console.log(response);
            });
    },

    /**
     * 获取行政区数据
     */
    getAreaDatas: function (city) {
        var that = this;
        var url = "consignment/area/" + that.data.selectCityCode;
        httpClient.request(url, {}, "GET",
            function (response) {
                var area = response.data.data;
                var len = area.length;
                var areaName = [];
                var areaCode = [];
                for (var i = 0; i < len; i++) {
                    areaName.push(area[i].description);
                    areaCode.push(area[i].code);
                }
                that.setData({
                    areaName: areaName,
                    areaCode: areaCode
                });
            },
            function (response) {
                console.log(response);
            });
    },

    /**
     * 开个按钮控制
     */
    handleZanSwitchChange(e) {
        this.setData({
            checked: e.checked
        });
    },

    /**
     * 收件人
     */
    blurName: function (e) {
        var value = e.detail.value;
        this.setData({ name: value });
    },

    /**
     * 手机号码
     */
    blurMobile: function (e) {
        var value = e.detail.value;
        this.setData({ mobile: value });
    },

    /**
     * 邮编
     */
    blurPostcode: function (e) {
        var value = e.detail.value;
        this.setData({ postcode: value });
    },

    /**
 * 详细地址
 */
    blurAddress: function (e) {
        var value = e.detail.value;
        this.setData({ address: value });
    },

    /**
     * 保存收件地址
     */
    saveConsignmentAddress: function () {
        var that = this;
        var isUsing = (that.data.checked) ? 1 : 0;
        var param = {
            "memberId": + wx.getStorageSync('memberId'),//会员唯一标识id
            "name": that.data.name,//收件人
            "mobile": that.data.mobile, //手机号码
            "province": that.data.selectProvinceCode, //省份
            "city": that.data.selectCityCode, //城市
            "area": that.data.selectAreaCode,//区域
            "address": that.data.address,//详细地址
            "postcode": that.data.postcode,//邮编
            "isUsing": isUsing //是否默认地址【1：是；0：否】
        };
        httpClient.request("consignment/insert/", param, "POST",
            function (response) {
                // 返回上一界面
                wx.navigateBack({
                    delta: 1
                });
            },
            function (response) {
                console.log(response);
            });
    }
}));