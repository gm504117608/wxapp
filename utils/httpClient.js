var app = getApp();

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
    success: success,
    fail: fail,
    complete: function () {
      // complete
      console.log("...complete...");
    }
  })
};

module.exports = {
  request: request
}