const db = wx.cloud.database()
Page({
  data: {
    userStatus: 0
  },
  onLoad: function () {
    this.setData({
      swp: wx.getStorageSync('source').my.iconList
    })
  },

  onShow() {
    let userInfo
    let userStatus = wx.getStorageSync('userStatus')

    if (userStatus === 1) {
      userInfo = wx.getStorageSync('userInfo')
    }
    this.setData({
      userInfo,
      userStatus
    })
  },

  error() {
    this.setData({
      url: '/images/app.png'
    })
  },

  //登陆页面
  toLogin() {
    wx.navigateTo({
      url: '../login/login',
    })
  },

  toPersion() {
    wx.navigateTo({
      url: '../my/person/person',
    })
  },

  iconTap(e) {
    var userStatus = wx.getStorageSync('userStatus')
    if (userStatus) {
      var url = e.currentTarget.dataset.url
      wx.navigateTo({
        url: url,
      })
    } else {
      wx.showModal({
        content: '账号未登录，请先登录！',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../login/login?pageId=my',
            })
          }
        }
      })
    }
  }
})