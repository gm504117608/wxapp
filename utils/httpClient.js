var util = require('util.js');
var app = getApp();

/**
 * 非文件上传请求方法
 */
function request(url, param, method, success, fail) {
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
        util.showLoading(message);
      } else {
        success(res.data.data);
      }
    },
    fail: function (res) {
      fail(res);
    },
    complete: function (res) {
      // complete
    }
  })
};

/**
 * 文件上传请求方法
 */
function uploadFile(url, param, filePath, success, fail) {
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
        util.showLoading(message);
      } else {
        success(res.data.data);
      }
    },
    fail: function (res) {
      fail(res);
    },
    complete: function (res) {
      // complete
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
      },
      function (response) {
        console.log(response);
      });
  }
  return result;
};

module.exports = {
  request: request,
  uploadFile: uploadFile,
  getConfigInfoByType: getConfigInfoByType
}