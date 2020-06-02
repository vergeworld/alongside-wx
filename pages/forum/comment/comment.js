const db = wx.cloud.database();
const _ = db.command;
var up = require('../../../js/compressed.js');
var sub = require('../../../js/comment.js');
var userId;
var id
Page({
  data: {
    useKeyboardFlag: true,
    keyboardInputValue: '',
    sendMoreMsgFlag: false,
    deleteIndex: -1,
    currentAudio: '',
    commentList: [],
    imgWidth: [],
    imgHeight: [],
    mode: [],
    ons: [],
    comment: {},
    value: '',
  },
  onLoad: function (e) {
    id = e.id;
    userId = e.userId;
    this.postList()
  },

  postList: function () {
    var that = this;
    db.collection("forum").doc(id).get({
      success(res) {
        var postList = res.data
        that.setData({
          postList,
          commentList: postList.commentList.reverse(),
          id
        })
        that.img()
      },
      fail(err) {
        that.setData({
          loadImg: '/images/post/3.4.png',
          loadTxt: '网络似乎出了点问题~'
        })
      }
    })
  },

  preview: function (e) {
    var i = e.currentTarget.id
    var postList = this.data.postList.commentList
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

  inputTyping: function (e) {
    //搜索数据
    var value = e.detail.value
    // 内容检测
    if (value) {
      wx.cloud.callFunction({
        name: 'msgcheck',
        data: {
          content: value
        }
      }).then(ckres => {
        if (ckres.result.errCode == 87014) {
          wx.showToast({
            title: '请注意言行',
            icon: 'none'
          })
          this.setData({
            value: ''
          })
        }
      })
    }
  },

  chooseImage(event) {
    var num = 3
    var route = 'forum/comment/'
    var ons = this.data.ons;
    up.chooseImage(event, ons, num, route, this)
  },

  //删除已经选择的图片
  deleteImage: function (event) {
    var index = event.currentTarget.dataset.idx;
    this.data.ons.splice(index, 1);
    this.setData({
      ons: this.data.ons
    });
  },

  // 提交评论
  formSubmit(e) {
    var ons = this.data.ons;
    var set = 'forum'
    sub.form(e, id, ons, db, set, this)
    db.collection('user').where({
      _openid:userId
    }).get({
      success(res){
        db.collection('user').doc(res.data[0]._id).update({
          data: {
            comment: _.inc(1)
          }
        })
      }
    })
  },

  // 图片展示
  img: function () {
    let that = this
    var postList = that.data.postList
    var number = postList.img.length
    if (number == 1) {
      that.setData({
        imgWidth: 710,
        imgHeight: 0,
        mode: 'widthFix'
      })
    } else if (number == 2 || number == 4) {
      that.setData({
        imgWidth: 356,
        imgHeight: 350,
        mode: 'aspectFill'
      })
    } else {
      that.setData({
        imgWidth: 237,
        imgHeight: 232,
        mode: 'aspectFill'
      })
    }
  },
})