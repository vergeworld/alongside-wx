const db = wx.cloud.database();
var up = require('../../../../js/compressed')
var sub = require('../../../../js/comment')
var forum = require('../../../../js/forum')
var id 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    postList: [],
    loadImg: '/images/post/3.3.gif',
    loadTxt: '拼命加载中...',
    ons: [],
  },

  // 生命周期函数--监听页面加载
  onLoad: function (e) {
    var that = this
     id = e.id
    db.collection('books').doc(id).get({
      success(res) {
        var postList = that.data.postList;
        postList[0] = res.data;
        let commentList = res.data.commentList;
        that.setData({
          postList,
          commentList
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
    var imgList = postList[i].tupian; //获取data-list
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
    var num = 3;
    var route = 'book/comment/';
    var ons = this.data.ons;
    up.chooseImage(event, ons, num, route, this)
  },

  //删除已经选择的图片
  deleteImage: function (event) {
    that = this;
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
    var set = 'books'
    sub.form(e, id, ons, db, set, this)
  },


  onPageScroll(e) {
    forum.scroll(e, this)
  },

  //转发
  onShareAppMessage: function (res) {
    let userName = wx.getStorageSync('name')
    if (!userName) {
      wx.showToast({
        title: '您还未登录,请先登录~',
        icon: 'none'
      })
      setTimeout(() => {
        wx.switchTab({
          url: '../my/my',
        })
      }, 1200)
    } else {
      var postId = res.target.dataset.id
      var img = this.data.postList[0].img
      var book = this.data.postList[0].book
      return {
        title: '好书推荐：' + book,
        imageUrl: img,
        path: '/pages/around/book/detail/detail?id=' + postId,
      }
    }
  },
})