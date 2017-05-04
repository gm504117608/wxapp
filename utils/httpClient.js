var util = require('util.js');
var app = getApp();

/**
 * 非文件上传请求方法
 */
function request(url, param, method, success, fail) {
  wx.showLoading({ "title": "正在加载中...", "mask": true });
  wx.request({
    url: app.globalParam.serverUrl + url,
    data: param,
    header: {
      'content-type': 'application/json',
      'token': wx.getStorage({ key: 'token' })
    },
    method: method,
    dataType: "json",
    success: function (res) {
      console.log(res);
      var data = res.data;
      var code = data.code;
      var message = data.message;
      if (code != 0) {
        util.showModal(message);
      } else {
        success(res.data.data);
      }
    },
    fail: function (res) {
      util.showModal("亲，系统生病了需要去看医生。");
      if (null != fail && (typeof fail) == 'function') {
        fail(res);
      }
    },
    complete: function (res) {
      wx.hideLoading();
    }
  })
};

/**
 * 文件上传请求方法
 */
function uploadFile(url, param, filePath, success, fail) {
  wx.showLoading({ "title": "正在加载中...", "mask": true });
  var path = app.globalParam.serverUrl + url;
  wx.uploadFile({
    url: path,
    filePath: filePath,
    name: 'file',
    header: {
      'content-type': 'multipart/form-data'
    },
    formData: param,
    success: function (res) {
      console.log(res);
      var data = JSON.parse(res.data);
      var code = data.code;
      var message = data.message;
      if (code != 0) {
        util.showModal(message);
      } else {
        success(res.data.data);
      }
    },
    fail: function (res) {
      util.showModal("亲，系统生病了需要去看医生。");
      if (null != fail && (typeof fail) == 'function') {
        fail(res);
      }
    },
    complete: function (res) {
      wx.hideLoading();
    }
  })
};

/**
 * 获取指定配置类型的基础配置信息
 * @param type 配置类型 
 */
function getConfigInfoByType(types) {
  var result = wx.getStorageSync(types);
  if (isNull(result)) {
    var url = "/orders/config/" + types;
    httpClient.request(url, {}, "GET",
      function (response) {
        // 将配置信息存入缓存
        result = response;
        wx.setStorageSync("types", result);
      });
  }
  return result;
};

module.exports = {
  request: request,
  uploadFile: uploadFile,
  getConfigInfoByType: getConfigInfoByType
}