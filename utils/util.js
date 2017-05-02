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
 */
function getArrayIndexByValue(array, value) {
  if (null == array || !(array instanceof Array)) {
    return -1;
  }
  var len = array.length;
  for (var i = 0; i < len; i++) {
    if (array[i] === value) {
      return i;
    }
  }
}

/**
 * 如果给定的金额不够两位小数，用0补齐
 */
function fillUpMoneyTwoDecimals(money) {
  return money.toFixed(2);
}

module.exports = {
  showLoading: showLoading,
  cancelLoading: cancelLoading,
  showModaling: showModaling,
  isNull: isNull,
  isNotNull: isNotNull,
  getArrayIndexByValue: getArrayIndexByValue,
  fillUpMoneyTwoDecimals: fillUpMoneyTwoDecimals
}
