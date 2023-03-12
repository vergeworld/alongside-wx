const db = wx.cloud.database();
const _ = db.command
var tp = require('../../../js/trips');
var ig = require('../../../js/imgLayout');
var sy = require('../../../js/system')
var openId;
Page({
  data: {
    total: 'find',
  },

  onLoad: function (e) {
    var that = this
    let userInfo = wx.getStorageSync('userInfo')
    console.log(userInfo);
    openId = userInfo._openid
    wx.showLoading({
      title: '正在加载',
    })
    db.collection('trips')
      .where({
        _openid: openId
      })
      .orderBy('time', 'desc')
      .get({
        success(res) {
          wx.hideLoading()
          var postList = ig.imgLayout(res.data)
          that.setData({
            skip: 0,
            postList,
            userInfo
          })
          if (!res.data[0]) {
            sy.system(225, that)
            that.setData({
              notPost: true,
            })
          }
        },
        fail(err) {
          wx.hideLoading()
          wx.showToast({
            icon: 'none',
            title: '网络异常，请稍后重试',
          })
        }
      })
  },
  // 页面下拉加载刷新
  onReachBottom: function (res) {
    let skip = this.data.skip + 20;
    var postList = this.data.postList
    tp.reachBottom(skip, postList, openId, this)
  },




  //阅读数量累计
  toDetail: function (e) {
    var postId = e.currentTarget.dataset.id;
    var userId = e.currentTarget.dataset.userid;
    wx.navigateTo({
      url: '../../home/detail/detail?id=' + postId + "&num=" + userId,
    })
  },

  // 阻止事件冒泡
  catchShare(e) {},




  //转发
  onShareAppMessage: function (res) {
    var postList = this.data.postList
    var postId = res.target.dataset.id;
    var i = res.target.dataset.index;
    var imageUrl = postList[i].imgs[0];
    var title = postList[i].content
    if (!imageUrl) {
      imageUrl = '/images/app.png'
    }
    var title = postList[i].content
    if (!title) {
      title = '多拼车，少开车，快乐随行。'
    }
    return {
      title: title,
      imageUrl: imageUrl,
      path: '/pages/home/detail/detail?id=' + postId,
    }
  },

  // 页面高度监控
  onPageScroll(e) {
    sy.scroll(e, this)
  },

  // 返回链接
  back: function () {
    wx.navigateBack()
  },
})