const db = wx.cloud.database();
var up = require("../../../js/compressed.js")
var sub = require('../../../js/comment')
var id
Page({
  // 页面的初始数据
  data: {
    navData: [{
        text: '班型',
      },
      {
        text: '驾校'
      },
      {
        text: '评论',
      }
    ],
    hidden: false,
    currentTab: 0,
    postList: [],
    navScrollLeft: 0,
    isfixed: 0,
    ons: [],
  },

  // 生命周期函数--监听页面加载
  onLoad: function (e) {
    id = e.id
    var that = this
    this.system()
    db.collection("drive").doc(id).get({
      success(res) {
        var postList = that.data.postList
        postList[0] = res.data
        var commentList = postList[0].commentList.reverse()
        var score = parseInt(postList[0].grade)
        var openId = wx.getStorageSync('openId')
        if (!openId) {
          that.setData({
            postList,
            score,
            commentList,
          })
        } else {
          db.collection('drive_tj').where({
            postId: id
          }).get({
            success(res) {
              if (res.data[0]) {
                postList[0].hasChange = true
                that.setData({
                  postList,
                  score,
                  commentList,
                })
              } else {
                that.setData({
                  postList,
                  score,
                  commentList,
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

  // 获取当前屏幕高度
  system() {
    //高度大小
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

  chooseImage(event) {
    var num = 3
    var route = 'drive/comment/'
    var ons = this.data.ons;
    up.chooseImage(event, ons, num, route, this)
  },


  //删除已经选择的图片
  deleteImage: function (event) {
    var index = event.currentTarget.dataset.idx,
      that = this;
    that.data.ons.splice(index, 1);
    setTimeout(function () {
      that.setData({
        ons: that.data.ons
      });
    }, 500)
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
    var set = 'drive'
    sub.form(e, id, ons, db, set, this)
  },

  //推荐数量累计
  like: function (e) {
    let postList = this.data.postList
    var set = 'drive';
    var set_tj = 'drive_tj';
    sub.recommend(postList,set,set_tj,id, this)
  },

  //转发
  onShareAppMessage: function (res) {
    var postId = res.target.dataset.id
    console.log(postId)
    var img = this.data.postList[0].img
    var nicheng = this.data.postList[0].drive
    return {
      title: '好友分享~' + nicheng,
      path: '/pages/drive/detail/detail?id=' + postId,
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

  // 报名页面
  sign(e) {
    wx.navigateTo({
      url: '../signup/signup?id=' + id,
    })
  },

  //班型
  type(e) {
    var postId = e.currentTarget.dataset.id
    var num = e.currentTarget.dataset.num
    wx.navigateTo({
      url: '../type/type?id=' + postId + "&num=" + num,
    })
  }
})