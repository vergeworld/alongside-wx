const db = wx.cloud.database();
Page({
  // 页面的初始数据
  data: {
    page: 0,
  },
  onLoad() {
    var that = this
    db.collection('_swiper').get({
      success(res) {
        that.setData({
          wall_img: res.data[0].my.order
        })
      }
    })
    db.collection('shop').orderBy('buy', 'desc').get({
      success(res) {
        that.setData({
          postList: res.data,
        })
      }
    })
  },

  // 触底刷新
  onReachBottom: function (res) {
    var that = this
    wx.showLoading({
      title: '加载中...',
    })
    var page = that.data.page + 20;
    db.collection('shop').orderBy('buy', 'desc').skip(page).get({
      success: res => {
        var new_data = res.data
        if (new_data.length == 0) {
          wx.hideLoading()
          wx.showToast({
            title: '就那么多啦！',
            icon: 'none'
          })
        } else {
          var postList = that.data.postList
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

  snacks() {
    wx.navigateTo({
      url: '../../my/order/snacks/snacks',
    })
  },
  package() {
    wx.navigateTo({
      url: '../../my/order/package/package',
    })
  },
  // 详情页面
  detail(e) {
    var postId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../../around/shop/detail/detail?id=' + postId,
    })
  },
})