const db = wx.cloud.database();
let pageId
Page({
  data: {
    noPhone: true
  },
  onLoad: function (e) {
    pageId = e.pageId
    var userInfo = wx.getStorageSync('userInfo')
    this.setData({
      userInfo,
      phone: userInfo.phone
    })
  },


  formSubmit(e) {
    let that = this;
    let mobile = e.detail.value.phone.replace(/\D/g, '')
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|(19[0-9]{1}))+\d{8})$/;
    if (mobile.length == 0) {
      wx.showToast({
        title: '输入的手机号为空，，请重新输入！',
        icon: 'none',
        duration: 1500
      })
    } else if (mobile.length < 11) {
      wx.showToast({
        title: '手机号长度有误，请重新输入！',
        icon: 'none',
        duration: 1500
      })
      this.setData({
        mobileFormat: false,
      })

    } else if (!myreg.test(mobile)) {
      wx.showToast({
        title: '手机号有误，请重新输入！',
        icon: 'none',
        duration: 1500
      })
    } else {
      wx.showLoading({
        title: '正在保存...',
      })
      let userInfo = that.data.userInfo
      let id = userInfo._id
      db.collection('user').doc(id).update({
        data: {
          phone: mobile
        },
        success() {
          userInfo.phone = mobile
          wx.setStorageSync('userInfo', userInfo)
          that.setData({
            havePhone: false
          })
          console.log('==================>pageId', pageId);
          // pageId 1:表示 my, 2:表示 publish, 0:表示 persion
          if (pageId === "my") {
            wx.switchTab({
              url: '/pages/my/my',
            })
          } else if (pageId === "publish") {
            wx.switchTab({
              url: '/pages/publish/publish',
            })
          } else {
            wx.navigateBack({
              delta: 1,
            })
          }
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
  },
  onUnload() {
    wx.setStorageSync('noPhone', this.data.noPhone)
  }
})