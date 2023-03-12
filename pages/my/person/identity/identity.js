const db = wx.cloud.database();
Page({
  data: {},
  onLoad: function (options) {
    let userStatus = wx.getStorageSync('userStatus')
    if (userStatus) {
      var {
        identify
      } = wx.getStorageSync('userInfo')
      var source = wx.getStorageSync('source')
      this.setData({
        identity: identify,
        idImg: source.my.identify
      })
    }
  },

  onShow() {

  },


  formSubmit(e) {
    let userInfo = wx.getStorageSync('userInfo')
    let id = userInfo._id
    // -1:表示没有选择，0：表示乘客，1：表示车主
    let identify = e.target.dataset.id
    if (identify === userInfo.identify) {
      wx.navigateBack({
        delta: 1,
      })
      return
    }
    wx.showLoading({
      title: '正在保存...',
    })
    db.collection('user').doc(id).update({
      data: {
        identify
      },
      success(e) {
        userInfo.identify = identify
        wx.setStorageSync('userInfo', userInfo)
        wx.setStorageSync('isReloadHome', true)
        setTimeout(() => {
          wx.navigateBack({
            delta: 1,
          })
        }, 500);
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