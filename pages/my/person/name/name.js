const db = wx.cloud.database();
Page({
  data: {

  },
  onLoad: function (options) {
    var name = wx.getStorageSync('name')
    this.setData({
      name
    })
  },

  input(e) {
    var name = e.detail.value
    this.data.name = name
  },

  save() {
    wx.showLoading({
      title: '正在保存...',
    })
    var name = this.data.name
    if (name) {
      wx.setStorageSync('name', name)
      var id = wx.getStorageSync('id')
      var img = wx.getStorageSync('img')
      db.collection('user').doc(id).update({
        data: {
          name: name
        },
      })
      wx.cloud.callFunction({
        name: 'forum',
        data: {
          name: name,
          url: img
        },
        success(res) {
          wx.navigateBack()
        },
        fail(err) {
          wx.showToast({
            title: '修改失败',
            icon: 'none',
            duration: 2000
          })
        },complete(){
          wx.hideLoading()
        }
      })
    }

  }
})