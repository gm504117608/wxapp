var httpClient = require('../../../../utils/httpClient.js');
var util = require('../../../../utils/util.js');
var Zan = require('../../../dist/index');

var app = getApp();

Page(Object.assign({}, Zan.Switch, Zan.Toast, {
    data: {
        id: '', // 收货地址唯一标识
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
        checked: false, // 是否默认收货地址
        name: '',
        mobile: '',
        postcode: '',
        address: ''
    },

    onLoad: function (options) {
        var that = this;
        // 获取省份数据
        that.getProvinceDatas();
        // 前一界面传入的收货地址唯一标识
        var id = options.id;
        // 获取收货地址数据
        if (util.isNotNull(id)) { // 修改功能
            var url = "consignment/" + id;
            httpClient.request(url, {}, "GET",
                function (response) {
                    var result = response;
                    var isUsing = (result.isUsing === 1) ? true : false;
                    var provinceIndex = util.getArrayIndexByValue(that.data.provinceCode, result.province);
                    that.getCityDatas(result.province);
                    var cityIndex = util.getArrayIndexByValue(that.data.cityCode, result.city);
                    that.getAreaDatas(result.city);
                    var areaIndex = util.getArrayIndexByValue(that.data.areaCode, result.area);
                    that.setData({
                        id: id,
                        name: result.name,
                        mobile: result.mobile,
                        postcode: result.postcode,
                        address: result.address,
                        selectProvinceCode: result.province,
                        selectCityCode: result.city,
                        selectAreaCode: result.area,
                        provinceIndex: provinceIndex,
                        cityIndex: cityIndex,
                        areaIndex: areaIndex,
                        checked: isUsing
                    });
                });
        }

    },

    /**
     * 获取省份数据
     */
    onProvinceChange: function (e) {
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
        that.getCityDatas(code);
    },

    /**
     * 获取城市数据
     */
    onCityChange: function (e) {
        var that = this;
        var index = e.detail.value;
        var code = that.data.cityCode[index];
        that.setData({
            selectCityCode: code,
            cityIndex: index,
            selectAreaCode: '',
            areaIndex: 0
        });
        that.getAreaDatas(code);
    },

    /**
     * 获取行政区数据
     */
    onAreaChange: function (e) {
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
                var province = response;
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
            });
    },

    /**
     * 获取城市数据
     */
    getCityDatas: function (selectProvinceCode) {
        var that = this;
        var url = "consignment/city/" + selectProvinceCode;
        httpClient.request(url, {}, "GET",
            function (response) {
                var city = response;
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
            });
    },

    /**
     * 获取行政区数据
     */
    getAreaDatas: function (selectCityCode) {
        var that = this;
        var url = "consignment/area/" + selectCityCode;
        httpClient.request(url, {}, "GET",
            function (response) {
                var area = response;
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
            });
    },

    /**
     * 是否默认地址
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
        if (util.isNull(that.data.name)) {
            that.showToast("收件人姓名不能为空");
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
        if (util.isNull(that.data.selectProvinceCode)) {
            that.showToast("请选择省份");
            return;
        }
        if (util.isNull(that.data.selectCityCode)) {
            that.showToast("请选择城市");
            return;
        }
        if (util.isNull(that.data.selectAreaCode)) {
            that.showToast("请选择区县");
            return;
        }
        if (util.isNull(that.data.address)) {
            that.showToast("详细地址不能为空");
            return;
        }
        var isUsing = (that.data.checked) ? 1 : 0;
        var param = {
            "id": that.data.id, // 收货地址唯一标识
            "memberId": wx.getStorageSync('memberId'),// 会员唯一标识id
            "name": that.data.name,// 收件人
            "mobile": that.data.mobile, // 手机号码
            "province": that.data.selectProvinceCode, // 省份
            "city": that.data.selectCityCode, // 城市
            "area": that.data.selectAreaCode,// 区域
            "address": that.data.address,// 详细地址
            "postcode": that.data.postcode,// 邮编
            "isUsing": isUsing // 是否默认地址【1：是；0：否】
        };
        httpClient.request("consignment/save/", param, "POST",
            function (response) {
                // 返回上一界面
                wx.redirectTo({
                    url: "../consignee-address/consignment-address"
                });
            });
    },

    showToast: function (title) {
        this.showZanToast(title);
    }
}));