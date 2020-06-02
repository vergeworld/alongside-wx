var pre = require('../../js/img.js');
var forum = require('../../js/forum');
const db = wx.cloud.database();
const _ = db.command
var openId;
var imgW = [];
var imgH = [];
var imgM = [];
Page({
  data: {
    postList: [{
      time: 0
    }],
    page: 0,
    img: '',
    top: '',
  },
  // 页面初次渲染
  onLoad() {
    var that = this;
    that.wallimg()
    openId = wx.getStorageSync('openId')
    db.collection('forum').orderBy('time', 'desc').get({
      success(res) {
        let postList = res.data
        pre.img(postList, 0, imgW, imgH, imgM, that)
        for (let i = 0; i < postList.length; i++) {
          postList[i].commentList.reverse()
        }
        that.setData({
          postList,
          page: 0,
        })
        if (openId) {
          for (let i = 0; i < postList.length; i++) {
            var postId = postList[i]._id
            db.collection('forum_dz').where({
              postId: postId
            }).get({
              success(res) {
                if (res.data[0]) {
                  postList[i].hasChange = true
                  that.setData({
                    postList
                  })
                }
              }
            })
          }
        }
      },
      fail(err) {
        wx.showToast({
          title: '网络似乎出现了问题~~',
          icon: 'none'
        })
      }
    })
  },

  // 顶部图片加载
  wallimg() {
    var that = this
    db.collection('_swiper').get({
      success(res) {
        that.setData({
          wall: res.data[0].forum.wall,
          badge: res.data[0].forum.badge
        })
      }
    })
  },

  //页面事件监控
  onShow() {
    var that = this
    var time = that.data.postList[0].time
    if (that.data.top < 3) {
      db.collection('forum').orderBy('time', 'desc').get({
        success(res) {
          var up_time = res.data[0].time
          if (time < up_time) {
            that.onLoad()
          }
        }
      })
    }
  },


  //下拉刷新
  onPullDownRefresh() {
    this.onLoad()
    wx.stopPullDownRefresh()
  },

  // 页面下拉加载刷新
  onReachBottom: function (res) {
    var that = this
    wx.showLoading({
      title: '正在加载...'
    })
    var page = that.data.page + 20;
    db.collection('forum').orderBy('time', 'desc').skip(page).get({
      success: res => {
        var new_data = res.data
        for (let i = 0; i < new_data.length; i++) {
          new_data[i].commentList.reverse()
        }
        if (new_data.length == 0) {
          wx.hideLoading()
          wx.showToast({
            title: '就这么多啦！',
            icon: "none"
          })
        } else {
          pre.img(new_data, page, imgW, imgH, imgM, that);
          var old_data = that.data.postList;
          var postList = old_data.concat(new_data);
          that.setData({
            postList,
            page
          })
          if (openId) {
            for (let i = 0; i < new_data.length; i++) {
              var j = i + page;
              var postId = postList[j]._id
              db.collection('forum_dz').where({
                postId: postId
              }).get({
                success(res) {
                  if (res.data[0]) {
                    postList[j].hasChange = true
                    that.setData({
                      postList
                    })
                  }
                }
              })
            }
          }
          wx.hideLoading()
        }
      }
    })
  },

  //轮播图点击预览
  preview: function (e) {
    var postList = this.data.postList
    pre.preview(e, postList)
  },

  //阅读数量累计
  read: function (e) {
    forum.read(e)
  },

  //点赞数量累计
  like: function (e) {
    var postList = this.data.postList;
    forum.praise(e, postList, this)
  },

  //转发
  onShareAppMessage: function (res) {
    var postList = this.data.postList;
    var postId = res.target.dataset.id;
    var i = res.target.dataset.index;
    var img = postList[i].img[0];
    var txt = postList[i].text
    return {
      title: '#' + txt,
      imageUrl: img,
      path: '/pages/forum/comment/comment?id=' + postId,
    }
  },

  // 页面高度监控
  onPageScroll(e) {
    forum.scroll(e, this)
  },

  // 个人页面跳转
  my: function (e) {
    var openId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: 'my/my?id=' + openId,
    })
  },

  //评论页面跳转
  comment: function (e) {
    var postId = e.currentTarget.dataset.id;
    var userId = e.currentTarget.dataset.userid;
    wx.navigateTo({
      url: 'comment/comment?id=' + postId + "&num=" + userId,
    })
  },

  //上传分享页面跳转
  share: function () {
    wx.navigateTo({
      url: '../forum/share/share',
    })
  },
})