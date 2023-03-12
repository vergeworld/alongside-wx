//app.js
const wxapi = require('utils/wxapi.js')
App({
  onLaunch: function () {
    wx.cloud.init({
      // env: "text-9g0wotz978137761",
      env: "alongside-linshan-4esljl29f63712",
      traceUser: true
    })

    // 小程序版本控制
    let newVersion = '2.1.4'
    let oldVersion = wx.getStorageSync('app_version') || '0.0.0'
    const _shouldUpdate = (oldVersion, newVersion) => {
      // 补全代码
      const oldArr = oldVersion.split('.')
      const newArr = newVersion.split('.')
      const needUpdate = oldArr.findIndex((row, index) => {
        if (Number(row) < Number(newArr[index])) {
          return true
        }
      })
      return needUpdate != -1
    }
    if (_shouldUpdate(oldVersion, newVersion)) {
      wx.removeStorageSync('userInfo')
      wx.setStorageSync('userStatus', 0);
      wx.setStorageSync('app_version', newVersion)
    }
  },



  onError(msg) {
    wx.switchTab({
      url: '/pages/home/home',
    })
  },
  /**
   * 全局属性
   */
  globalData: {
    wxapi: wxapi,
  }
})