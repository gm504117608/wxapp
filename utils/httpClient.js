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
      }
      success(res.data.data);
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
      var data = res.data;
      var code = data.code;
      var message = data.message;
      if (code != 0) {
        util.showLoading(message);
      }
      success(res.data.data);
    },
    fail: function (res) {
      fail(res);
    },
    complete: function (res) {
      // complete
    }
  })
};

module.exports = {
  request: request,
  uploadFile: uploadFile
}