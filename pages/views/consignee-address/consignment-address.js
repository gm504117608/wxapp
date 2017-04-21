var app = getApp();

Page({
  data: {
    id: ''
  },

  onLoad: function (options) {
    // 前一界面传入的用户id
    this.setData({id: options.id});
  },

  onShow: function() {
  },
})
