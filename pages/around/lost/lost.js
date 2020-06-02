const db = wx.cloud.database();
var pattern = require('../../../js/img.js');
var imgW = [];
var imgH = [];
var imgM = [];
Page({
  data: {
    page: 0,
    posttList: [],
    top: '',
    not_net: true,
    not_order: false
  },
  onLoad: function () {
    var that = this;
    db.collection('lost').orderBy('time', 'desc').get({
      success(src) {
        if (src.data.length == 0) {
          that.setData({
            not_order: true,
            not_net: false
          })
        } else {
          var postList = src.data;
          pattern.img(postList, 0, imgW, imgH, imgM, that);
          that.setData({
            postList: src.data,
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

  onShow() {
    this.onLoad()
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
      isfixed
    });
  },

  // 页面下拉加载刷新
  onReachBottom: function (res) {
    wx.showLoading({
      title: '正在加载...',
    })
    let page = this.data.page + 20;
    db.collection('lost').orderBy('time', 'desc').skip(page).get({
      success: res => {
        let new_data = res.data
        if (!new_data[0]) {
          wx.showToast({
            title: '就那么哆啦~',
            icon: 'none'
          })
          this.setData({
            not_more: true
          })
        } else {
          pattern.img(new_data, page, imgW, imgH, imgM, this);
          let old_data = this.data.postList
          let postList = old_data.concat(new_data)
          this.setData({
            postList,
            page
          })
        }
      },
      fail(err) {
        wx.hideLoading()
        wx.showToast({
          title: '加载失败！',
          icon: 'none'
        })
      }
    })
  },

  //轮播图点击预览
  preview: function (e) {
    var i = e.currentTarget.id
    var that = this;
    var postList = that.data.postList
    var src = e.currentTarget.dataset.src; //获取data-src
    var imgList = postList[i].img; //获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },


  // 搜索页面
  search() {
    wx.navigateTo({
      url: '../../around/lost/search/search',
    })
  },

  upload: function () {
    wx.navigateTo({
      url: '../lost/upload/upload',
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})