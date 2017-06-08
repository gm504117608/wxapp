var util = require('util.js');
var app = getApp();

/**
 * 非文件上传请求方法
 * @param url 请求url地址
 * @param param 请求参数
 * @param method 请求类型 get post
 * @param success 成功回调函数
 * @param fail 失败回调函数
 * @param isShowLoading 是否显示加载提示 默认 true 
 */
function request(url, param, method, success, fail, isShowLoading) {
  if (util.isNull(isShowLoading)) {
    isShowLoading = true;
  }
  if (isShowLoading) {
    wx.showLoading({ "title": "正在加载中...", "mask": true });
  }
  var token = wx.getStorage({ key: 'token' });
  if (typeof (token) == "undefined") {
    token = '';
  }
  wx.request({
    url: app.globalParam.serverUrl + url,
    data: param,
    header: {
      'content-type': 'application/json',
      'token': token
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
      console.log(res);
      util.showModal("亲，系统生病了需要去看医生。");
      if (null != fail && (typeof fail) == 'function') {
        fail(res);
      }
    },
    complete: function (res) {
      if (isShowLoading) {
        wx.hideLoading();
      }
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

module.exports = {
  request: request,
  uploadFile: uploadFile
}