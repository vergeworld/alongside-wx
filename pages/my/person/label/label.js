const db = wx.cloud.database();
var sy = require('../../../../js/system.js')
Page({
  data: {
    label: '',
  },
  onLoad: function (options) {
    sy.system(406, this)
    var label = wx.getStorageSync('label')
    this.setData({
      label
    })
  },

  input(e) {
    var label = e.detail.value
    this.data.label = label
  },

  save() {
    wx.showLoading({
      title: '正在保存...',
    })
    var label = this.data.label
      wx.setStorageSync('label', label)
      var id = wx.getStorageSync('id')
      db.collection('user').doc(id).update({
        data: {
          label: label
        },
        success() {
          wx.navigateBack()
        },
        fail() {
          wx.showToast({
            title: '添加失败！',
            icon: 'none',
            duration: 2000
          })
        },complete(){
          wx.hideLoading()
        }
      })
  }
})