const db = wx.cloud.database();
var sy = require('../../../js/system.js')
Page({
  // 页面的初始数据
  data: {
    postList: [],
    loadImg: '/images/post/3.3.gif',
    loadTxt: '拼命加载中...',
    not_net: true,
    not_order: false,
    page: 0,
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    sy.system(105, this)
    var that = this
    db.collection('review').orderBy('grade', 'desc').get({
      success(res) {
        var postList = res.data;
        if (!postList[0]) {
          that.setData({
            not_order: true,
            not_net: false,
            loadImg: '/images/icon/4.8.png',
            loadTxt: '亲！还没有店铺入驻哦~'
          })
        } else {
          for (let i = 0; i < postList.length; i++) {
            var score = parseInt(postList[i].grade)
            console.log(score)
          }
          that.setData({
            postList,
            score,
            not_net: false
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

  // 触底刷新
  onReachBottom: function (res) {
    var that = this
    wx.showLoading({
      title: '加载中...',
    })
    let page = that.data.page + 20;
    db.collection('review').orderBy('grade', 'desc').skip(page).get({
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

  // 页面高度监控
  onPageScroll(e) {
    let isfixed = 1
    if (e.scrollTop < 55) {
      isfixed = 0
      this.setData({
        position: 'relative',
        isfixed
      });
    } else {
      isfixed = 1;
      this.setData({
        top: e.scrollTop,
        position: 'fixed',
        isfixed
      });
    }
  },

  // 店铺搜索页面
  search() {
    wx.navigateTo({
      url: '../../around/review/search/search',
    })
  },

  // 店铺详情页面
  store(e) {
    let postId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../review/store/store?id=' + postId,
    })
  },

  // 用户点击右上角分享
  onShareAppMessage: function () {

  }
})