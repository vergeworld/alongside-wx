const db = wx.cloud.database();
var up = require('../../../../js/compressed.js')
var sub = require('../../../../js/comment.js')
var id
Page({
  // 页面的初始数据
  data: {
    loadImg: '/images/post/3.3.gif',
    loadTxt: '拼命加载中...',
    navData: [{
        text: '美食',
      },
      {
        text: '店铺'
      },
      {
        text: '评论',
      }
    ],
    hidden: true,
    currentTab: 0,
    postList: [],
    navScrollLeft: 0,
    isfixed: 0,
    ons: [],
    botm: ''
  },

  // 生命周期函数--监听页面加载
  onLoad: function (e) {
    id = e.id
    var that = this
    that.system()
    var openId = wx.getStorageSync('openId')
    db.collection('review').doc(id).get({
      success(res) {
        var postList = that.data.postList
        postList[0] = res.data
        var score = parseInt(postList[0].grade)
          that.setData({
            postList,
            score,
            commentList: postList[0].commentList.reverse()
          })
          if (openId) {
          db.collection('review_tj').where({
            postId: id
          }).get({
            success(res) {
              if (res.data[0]) {
                postList[0].hasChange = true;
                that.setData({
                  postList,
                  score,
                  commentList: postList[0].commentList.reverse()
                })
              } 
            }
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

  system() {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        var screen_height = res.windowHeight - 162
        that.setData({
          screen_height
        })
      }
    });
  },

  //轮播图点击预览
  preview: function (e) {
    var i = e.currentTarget.id
    var that = this;
    var postList = that.data.commentList
    var src = e.currentTarget.dataset.src;
    var imgList = postList[i].imgs;
    wx.previewImage({
      current: src,
      urls: imgList
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
    var route = 'around/review/comment/';
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

  //推荐数量累计
  like: function (e) {
    let postList = this.data.postList
    console.log(postList)
    var set = 'review';
    var set_tj = 'review_tj';
    sub.recommend(postList, set, set_tj, id, this)
  },

  // 显示/隐藏评论输入框
  comment(e) {
    var hidden = e.currentTarget.dataset.h
    hidden = !hidden
    this.setData({
      hidden
    })
  },

  // 提交评论
  formSubmit(e) {
    var ons = this.data.ons;
    var set = 'review'
    sub.form(e, id, ons, db, set, this)
  },

  //转发
  onShareAppMessage: function (res) {
    var postId = res.target.dataset.id
    var img = this.data.postList[0].nameImg
    var nicheng = this.data.postList[0].name
    return {
      title: '好友分享~' + nicheng,
      desc: this.data.postList[0].txt,
      path: '/pages/around/review/store/store?id=' + postId,
      imageUrl: img,
    }
  },

  switchNav(event) {
    var cur = event.currentTarget.dataset.current;
    if (this.data.currentTab == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      })
    }
  },
  switchTab(event) {
    var cur = event.detail.current;
    this.setData({
      currentTab: cur
    });
  },
})