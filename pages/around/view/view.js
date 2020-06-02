const db = wx.cloud.database();
var up = require('../../../js/compressed')
var sub = require('../../../js/comment')
var forum = require('../../../js/forum')
var id
Page({
  // 页面的初始数据
  data: {
    postList: [],
    loadImg: '/images/post/3.3.gif',
    loadTxt: '拼命加载中...',
    ons: []
  },
  onLoad: function (e) {
    var that = this
    id = e.id
    db.collection("view").doc(id).get({
      success(res) {
        var postList = that.data.postList
        postList[0] = res.data
        var commentList = postList[0].commentList.reverse()
        var openId = wx.getStorageSync('openId')
        if (openId) {
          db.collection('view_tj').where({
            postId: id
          }).get({
            success(res) {
              if (res.data[0]) {
                postList[0].hasChange = true
                that.setData({
                  postList,
                })
              }
            }
          })
        }
        that.setData({
          postList,
          commentList,
        })
      },
      fail(err) {
        that.setData({
          loadImg: '/images/post/3.4.png',
          loadTxt: '网络似乎出了点问题~'
        })
      }
    })
  },

  //轮播图点击预览
  preview: function (e) {
    var i = e.currentTarget.id
    var that = this;
    var postList = that.data.postList.commentList
    var src = e.currentTarget.dataset.src; //获取data-src
    var imgList = postList[i].imgs; //获取data-list
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },

  //显示 选择照片、拍照等按钮
  sendMoreMsg: function () {
    this.setData({
      sendMoreMsgFlag: !this.data.sendMoreMsgFlag
    })
  },

  // 选择并上传图片
  chooseImage(event) {
    var num = 4;
    var route = 'around/view/comment/';
    var ons = this.data.ons;
    up.chooseImage(event, ons, num, route, this)
  },

  //删除已经选择的图片
  deleteImage: function (event) {
    var that = this
    var index = event.currentTarget.dataset.idx;
    that.data.ons.splice(index, 1);
    setTimeout(function () {
      that.setData({
        ons: that.data.ons
      });
    }, 500)
  },

  // 提交评论
  formSubmit(e) {
    var ons = this.data.ons;
    var set = 'view'
    sub.form(e, id, ons, db, set, this)
  },

  //推荐数量累计
  like: function (e) {
    let postList = this.data.postList
    var set = 'view';
    var set_tj = 'view_tj';
    sub.recommend(postList,set,set_tj,id, this)
  },

  // 页面高度监控
  onPageScroll(e) {
    forum.scroll(e, this)
  },

  // 用户点击右上角分享
  onShareAppMessage: function () {
  }
})