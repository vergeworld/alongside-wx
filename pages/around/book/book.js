const db = wx.cloud.database();
Page({
  // 页面的初始数据
  data: {
    postList: [],
    placeholder: '搜索书籍名称',
    loadImg: '/images/post/3.3.gif',
    loadTxt: '拼命加载中...',
    page: 0,
    not_net: true,
    not_order: false
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    var that = this
    db.collection("_swiper").get({
      success(res) {
        that.setData({
          swiper: res.data[0].around.book
        })
      }
    })
    db.collection('books').orderBy('time', 'desc').get({
      success(res) {
        var postList = res.data;
        if (!postList[0]) {
          that.setData({
            not_net: false,
            not_order: true,
            loadImg: '/images/icon/3.6.png',
            loadTxt: '还没有人推荐哦~~'
          })
        } else {
          that.setData({
            postList,
            not_net: false,
            page: 0
          })
        }
      },
      fail(err) {
        that.setData({
          loadImg: '/images/post/3.4.png',
          loadTxt: '网络似乎出了点问题~'
        })
      }
    })
  },

  //页面事件监控
  onShow() {
    this.onLoad()
  },


  // 触底刷新
  onReachBottom: function (res) {
    var that = this
    var page = that.data.page + 20;
    db.collection('books').orderBy('read', 'desc').skip(page).get().then(res => {
      var new_data = res.data
      if (!new_data[0]) {
        that.setData({
          not_more: true
        })
        wx.showToast({
          title: '就那么多啦~~',
          icon: 'none'
        })
      } else {
        var old_data = that.data.postList
        var postList = that.data.postList
        postList = old_data.concat(new_data)
        that.setData({
          postList,
          page
        })
      }
    })
  },

  // 页面高度监控
  onPageScroll(e) {
    this.setData({
      top: e.scrollTop
    });
  },

  // 书籍搜索页面
  search() {
    wx.navigateTo({
      url: '../book/search/search',
    })
  },

  // 书籍上传页面
  publish() {
    wx.navigateTo({
      url: '../book/publish/publish',
    })
  },

  // 书籍详情页面
  detail(e) {
    let postId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../book/detail/detail?id=' + postId,
    })
    const _ = db.command
    db.collection('books').doc(postId).update({
      data: {
        read: _.inc(1)
      }
    })
  },

  // 页面高度监控
  onPageScroll(e) {
    let isfixed = 1
    if (e.scrollTop < 50) {
      isfixed = 0
    } else {
      isfixed = 1;
    }
    this.setData({
      top: e.scrollTop,
      isfixed
    });
  },
  // 用户点击右上角分享
  onShareAppMessage: function () {}
})