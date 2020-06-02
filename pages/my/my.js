//index.js
//获取应用实例

Page({
  data: {
    not_log: true,
    img: '',
    nickName: '',
    titleList: [{
      tap: "share",
      icon: "/images/icon/4.0.png",
      title: "我的分享"
    },
    {
      tap: "order",
      icon: "/images/icon/6.6.png",
      title: "我的订单"
    }, {
      tap: "site",
      icon: "/images/icon/5.9.png",
      title: "我的地址"
    }
    ],
    titleList1: [{
      tap: "publish",
      icon: "/images/icon/4.1.png",
      title: "发布兼职"
    },
    {
      tap: "opinion",
      icon: "/images/icon/4.3.png",
      title: "用户反馈"
    }
    ]
  },
  onLoad: function () {
    var that = this
    var openId = wx.getStorageSync('openId');
    var img = wx.getStorageSync('img');
    var name = wx.getStorageSync('name');
    var label = wx.getStorageSync('label')
    if (openId) {
      that.setData({
        not_log: false,
        img,
        name,
        label,
      })
    } else {
      that.setData({
        not_log: true,
      })
    }
  },

  onShow() {
    this.onLoad()
  },

  //登陆页面
  login() {
    wx.navigateTo({
      url: '../login/login',
    })
  },

  //我的信息  
  person() {
    wx.navigateTo({
      url: '../my/person/person',
    })
  },

  // 我的分享
  share() {
    wx.navigateTo({
      url: '../my/share/share'
    })
  },

  // 我的订单
  order() {
    wx.navigateTo({
      url: '../my/order/order'
    })
  },

  // 我的地址
  site() {
    wx.navigateTo({
      url: '../my/site/site',
    })
  },

  // 兼职发布
  publish: function () {
    wx.navigateTo({
      url: '../my/publish/publish'
    })
  },

  // 意见反馈
  opinion() {
    wx.navigateTo({
      url: '../my/opinion/opinion',
    })
  },

  //客服中心
  service: function () {
    wx.navigateTo({
      url: '../my/service/service',
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () { }
})