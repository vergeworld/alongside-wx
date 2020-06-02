// 获取当前屏幕高度
function system(height, _this) {
  wx.getSystemInfo({
    success: function (res) {
      var screen_height = res.windowHeight - height
      _this.setData({
        screen_height
      })
    }
  });
}

module.exports = {
  system
}