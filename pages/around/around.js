const db = wx.cloud.database();
Page({
  data: {
    page: 0,
    imgsPath: [],
    postList: [],
    iconList: [{
        tap: "review",
        icon: "/images/icon/4.8.png",
        title: "万象点评"
      },
      {
        tap: "job",
        icon: "/images/icon/4.9.png",
        title: "兼职广场"
      },
      {
        tap: "shop",
        icon: "/images/icon/4.6.png",
        title: "零食铺子"
      },
      {
        tap: "book",
        icon: "/images/icon/3.6.png",
        title: "推荐好书"
      },
      {
        tap: "water",
        icon: "/images/icon/3.9.png",
        title: "送水驿站"
      },
      {
        tap: "lost",
        icon: "/images/icon/3.8.png",
        title: "失物中心"
      },
      {
        tap: "market",
        icon: "/images/icon/4.7.png",
        title: "跳蚤市场"
      },
      {
        tap: "package",
        icon: "/images/icon/3.7.png",
        title: "快递超市 "
      }
    ],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    db.collection("_swiper").get({
      success(res) {
        that.setData({
          imgsPath: res.data[0].around.around_wall
        })
      }
    })
    db.collection('view').orderBy('recommend','desc').get({
      success(res) {
        that.setData({
          postList: res.data,
          page: 0,
        })
      }
    })
  },

  onShow() {
    var imgsPath = this.data.imgsPath
    var postList = this.data.postList
    if (!imgsPath[0] && !postList[0]) {
      this.onLoad()
    }
  },


  // 触底刷新
  onReachBottom: function (res) {
    var that = this
    wx.showLoading({
      title: '加载中...',
    })
    let page = that.data.page + 20;
    db.collection('view').skip(page).get({
      success: res => {
        var new_data = res.data
        if (new_data.length == 0) {
          wx.hideLoading()
          wx.showToast({
            title: '就那么多啦！',
            icon: 'none'
          })  
        } else {
        let postList = that.data.postList
        postList = postList.concat(new_data)
        that.setData({
          postList,
          page
        })
        wx.hideLoading()
      }
      },
      fail() {
        wx.hideLoading()
        wx.showToast({
          title: '加载失败！',
          icon: 'none'
        })
      }
    })
  },

  view(e) {
    let postId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../around/view/view?id=' + postId,
    })
  },

  review() {
    wx.navigateTo({
      url: '../around/review/review',
    })
  },
  job() {
    wx.navigateTo({
      url: '../around/job/job',
    })
  },
  shop() {
    wx.navigateTo({
      url: '../around/shop/shop',
    })
  },
  book() {
    wx.navigateTo({
      url: '../around/book/book',
    })
  },
  water() {
    wx.navigateTo({
      url: '../around/water/water',
    })
  },
  lost: function () {
    wx.navigateTo({
      url: '../around/lost/lost',
    })
  },
  market: function () {
    wx.navigateTo({
      url: '../around/market/market',
    })
  },
  package: function () {
    wx.navigateTo({
      url: '../around/package/package',
    })
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {}
})