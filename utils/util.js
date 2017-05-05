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

/**
 * 页面加载提示显示 
 * @param title 显示标题
 * @param icon 图标，有效值 "success", "loading"	
 * @param image 自定义图标的本地路径，image 的优先级高于 icon
 * @param isAutoDisappear 是否需要设置提示延迟时间 true false 默认 false
 * @param duration 延迟时间 当isAutoDisappear为true是需要设置 不设置默认3000
 * @param mask 是否显示透明蒙层，防止触摸穿透，默认：false
 * */
function showLoading(title, icon, image, isAutoDisappear, duration, mask) {
  if (isNull(title)) {
    title = "默认提示";
  }
  if (isNull(isAutoDisappear)) {
    isAutoDisappear = false;
  }
  if (isAutoDisappear) {
    duration = 3000;
  }
  if (isNull(mask)) {
    mask = false;
  }
  if (isAutoDisappear) {
    wx.showToast({
      title: title,
      icon: icon,
      duration: duration,
      image: image,
      mask: mask
    });
  } else {
    wx.showToast({
      title: title,
      icon: icon,
      image: image,
      mask: mask
    });
  }
}

/**页面加载提示关闭 */
function cancelLoading() {
  wx.hideToast();
}

/**
 * 显示弹出框提示信息
 */
function showModal(msg) {
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
  showModal: showModal,
  isNull: isNull,
  isNotNull: isNotNull,
  getArrayIndexByValue: getArrayIndexByValue,
  fillUpMoneyTwoDecimals: fillUpMoneyTwoDecimals
}
