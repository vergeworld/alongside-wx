const db = wx.cloud.database()
Page({
  data: {
    items: [{
        name: '男',
        value: '男',
        checked: false,
      },
      {
        name: '女',
        value: '女',
        checked: false,
      }
    ]
  },

  onLoad() {
    var items = this.data.items
    var gender = wx.getStorageSync('gender')
    if (gender == '男') {
      items[0].checked = true
      this.setData({
        items
      })
    } else if (gender == '女') {
      items[1].checked = true
      this.setData({
        items
      })
    }
  },

  radioChange: function (e) {
    var gender = e.detail.value
    wx.setStorageSync('gender', gender)
    var id = wx.getStorageSync('id')
    db.collection('user').doc(id).update({
      data: {
        gender: gender
      },
      success() {
        wx.navigateBack()
      },
      fail() {
        wx.showToast({
          title: '修改失败！',
          icon: 'none',
          duration: 2000
        })
      }
    })
  }
})