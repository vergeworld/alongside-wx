const db = wx.cloud.database();
var sy = require('../../../../js/system.js')
Page({
  data: {},
  onLoad: function (options) {
    var userInfo = wx.getStorageSync('userInfo')
    this.setData({
      userInfo,
      label: userInfo.label,
    })
  },


  formSubmit(e) {
    let label = e.detail.value.textarea
    if (!label) {
      return
    }
    wx.showLoading({
      title: '正在保存...',
    })
    let userInfo = this.data.userInfo
    let id = userInfo._id
    db.collection('user').doc(id).update({
      data: {
        label
      },
      success() {
        userInfo.label = label
        wx.setStorageSync('userInfo', userInfo)
        wx.navigateBack({
          delta: 1,
        })
      },
      fail() {
        wx.showToast({
          title: '网络异常，请稍后重试！',
          icon: 'none',
        })
      },
      complete() {
        wx.hideLoading()
      }
    })
  }
})