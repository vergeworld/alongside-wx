const db = wx.cloud.database();
const _ = db.command;
var sub = require('../../../js/comment');
var sy = require('../../../js/system')
var util = require("../../../utils/util.js");

var id
Page({
  data: {
    ons: [],
    value: '',
    phone: '/images/phone.png'
  },
  onLoad: function (e) {
    var that = this;
    id = e.id;
    db.collection("trips").doc(id).get({
      success: res => {
        var post = that.img(res.data)
        var time = util.getDiffTime(post.time, true);
        post.time = time
        var comt = post.commentList
        for (let i = 0; i < comt.length; i++) {
          var time = util.getDiffTime(comt[i].time, true);
          post.commentList[i].time = time
        }
        that.setData({
          post,
          len: post.commentList.length,
          commentList: post.commentList
        })
      }
    })
  },

  // 图片布局
  img(post) {
    var len = post.imgs.length
    if (len == 0) {} else if (len == 1) {
      post.mode = "widthFix";
      post.imgW = 712;
      post.imgH = 250;
    } else if (len == 2) {
      post.imgW = 354;
      post.imgH = 175;
      post.mgW = 354;
      post.mgH = 175;
    } else if (len == 3) {
      post.imgW = 474;
      post.imgH = 234;
    } else if (len == 4) {
      post.imgW = 712;
      post.imgH = 200;
    } else if (len == 5) {
      post.imgW = 472;
      post.imgH = 116;
    } else if (len == 6) {
      post.imgW = 448;
      post.imgH = 234;
    } else if (len == 7) {
      post.imgW = 472;
      post.imgH = 352;
    } else if (len == 8) {
      post.imgW = 472;
      post.imgH = 116;
    } else if (len == 9) {
      post.imgW = 472;
      post.imgH = 234;
    }
    return post
  },

  // 拨打电话
  tel: function (e) {
    var phone = e.currentTarget.dataset.phone
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },

  postPrevieww(e) {
    let imgs = e.currentTarget.dataset.list
    let src = e.currentTarget.dataset.src
    wx.previewImage({
      urls: imgs,
      current: src
    })
  },


  // 提交评论
  formSubmit(e) {
    var set = 'trips'
    var len = this.data.len;
    let userStatus = wx.getStorageSync('userStatus')
    if (userStatus) {
      wx.showLoading({
        title: '发布中…',
        mask: true
      })
      var commentList = this.data.commentList;
      sub.form(e, id, set, len, commentList, this)
    } else {
      wx.showModal({
        title: '账号未登录，请先登录！',
        content: '',
        complete: (res) => {
          if (res.cancel) {
            wx.navigateBack()
          }
          if (res.confirm) {
            wx.navigateTo({
              url: './../../../login/login',
            })
          }
        }
      })
    }
  },

  // 个人页面跳转
  toPersion: function (e) {
    var openId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../personal/personal?id=' + openId,
    })
  }
})