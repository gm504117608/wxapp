function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 判断传入参数是否为空
 * 为空返回true，否则false
 * @param sInputs
 * @returns {boolean}
 */
function isNull(sInputs) {
  if (typeof sInputs == "object") {
    return false;
  }
  if (typeof (sInputs) == "undefined" || sInputs == null || sInputs == "") {
    return true;
  }
  return false;
}

/**
 * 判断传入参数是否为空
 * 为空返回true，否则false
 * @param sInputs
 * @returns {boolean}
 */
function isNotNull(sInputs) {
  return !(isNull(sInputs));
}

/**页面加载提示显示 */
function showLoading(title) {
  wx.showToast({
    title: title,
    icon: 'success',
    duration: 3000
  });
}

/**页面加载提示关闭 */
function cancelLoading() {
  wx.hideToast();
}

/**
 * 显示弹出框提示信息
 */
function showModaling(msg) {
  wx.showModal({
    title: '提示',
    content: msg,
    showCancel: false,
    success: function (res) {
      if (res.confirm) {
        console.log('用户点击确定')
      }
    }
  });

}

/**
 * 通过元素值获取元素在数组的下标
 * @param array 数组
 * @param value 元素值
 * 
 */
function getArrayIndexByValue(array, value) {
  if(null == array || !(array instanceof Array)){
    return -1;
  }
  var len = array.length;
  for (var i = 0; i < len; i++) {
    if (array[i] === value) {
      return i;
    }
  }
}

module.exports = {
  formatTime: formatTime,
  showLoading: showLoading,
  cancelLoading: cancelLoading,
  showModaling: showModaling,
  isNull: isNull,
  isNotNull: isNotNull,
  getArrayIndexByValue: getArrayIndexByValue
}
