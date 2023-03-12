const db = wx.cloud.database();
Page({
  data: {

  },
  onLoad: function (options) {
    var userInfo = wx.getStorageSync('userInfo')
    this.setData({
      userInfo,
      disabled: true,
      nickName: userInfo.nickName
    })
  },

  input(e) {
    var old_name = this.data.userInfo.nickName
    var nickName = e.detail.value
    if (nickName == old_name || nickName.length == 0) {
      this.setData({
        disabled: true
      })
    } else {
      this.setData({
        nickName,
        disabled: false
      })
    }
  },

  save() {
    wx.showLoading({
      title: '正在保存...',
    })
    var nickName = this.data.nickName
    var userInfo = this.data.userInfo
    var id = userInfo._id
    db.collection('user').doc(id).update({
      data: {
        nickName
      },
    })
    db.collection('trips').where({
      _openid: userInfo._openid
    }).update({
      data: {
        nickName,
        avatarUrl:userInfo.avatarUrl
      },
      success(res) {
        userInfo.nickName = nickName
        wx.setStorageSync('userInfo', userInfo)
        wx.navigateBack()
      },
      fail(err) {
        wx.showToast({
          title: '修改失败',
          icon: 'none',
          duration: 2000
        })
      },
      complete() {
        wx.hideLoading()
      }
    })
  }
})