const db = wx.cloud.database();
Page({
  data: {
    page: 0,
    imgsPath: [],
    imgs: '',
    placeholder: '搜索商品',
    notice: "注意：本平台目前仅支持二手商品买卖信息公布，希望同学的互相转告。",
    isfixed: false,
    not_order: false,
    loading: true,
    show: false
  },
  
  onLoad: function () {
    var that = this;
    that.system()
    var img = wx.getStorageSync('img')
    db.collection("_swiper").get({
      success(res) {
        that.setData({
          img,
          imgsPath: res.data[0].around.market
        })
      }
    })
    db.collection('market').orderBy('time', 'desc').get({
      success(src) {
        if (src.data[0]) {
          that.setData({
            postList: src.data,
            loading: false,
            not_order: false,
            page: 0
          })
        } else {
          that.setData({
            postList: [],
            not_order: true,
            loading: false
          })
        }
      },
      fail(err) {
        that.setData({
          loading: true,
          loadImg: '/images/post/3.4.png',
          loadTxt: '网络似乎出了点问题~'
        })
      }
    })
  },

  // 获取屏幕高度
  system() {
    var that = this
    wx.getSystemInfo({
      complete: (res) => {
        that.setData({
          screen_height: res.windowHeight - 281
        })
      },
    })
  },

  //页面监控事件
  onShow() {
    this.onLoad()
  },
  //页面滑动监控
  onPageScroll(e) {
    let isfixed = 1
    if (e.scrollTop < 50) {
      isfixed = 0
    } else {
      isfixed = 1;
    }
    this.setData({
      isfixed
    });
  },


  // 下拉加载更多
  onReachBottom: function (res) {
    var that = this
    wx.showLoading({
      title: '正在加载...',
    })
    let page = that.data.page + 20;
    db.collection('market').orderBy('time', 'desc').skip(page).get().then(res => {
      let new_data = res.data
      if (new_data.length == 0) {
        wx.showToast({
          title: '就那么多啦！',
          icon: 'none'
        })
        that.setData({
          show: true
        })
        wx.hideLoading()
      } else {
        let old_data = that.data.postList
        var postList = that.data.postList
        postList = old_data.concat(new_data)
        that.setData({
          postList,
          page
        })
        wx.hideLoading()
      }
    })
  },
  people: function () {
    wx.navigateTo({
      url: '../people/people',
    })
  },

  publish() {
    wx.navigateTo({
      url: '../market/mygoods/mygoods',
    })
  },

  search() {
    wx.navigateTo({
      url: '../market/search/search',
    })
  },
  detail(e) {
    var postId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../market/detail/detail?id=' + postId,
    })
  }
})