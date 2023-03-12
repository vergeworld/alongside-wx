var util = require("../../../utils/util.js");
var up = require('../../../js/compressed')
const db = wx.cloud.database();
Page({
  data: {
    upImgs: []
  },

  // 选择图片
  chooseImage(event) {
    var num = 3;
    var upImgs = this.data.upImgs;
    var route = 'my/advice/';
    if (upImgs.length < num) {
      up.chooseImage(upImgs, num, route, this)
    } else {
      wx.showToast({
        title: '最多可以选择' + num + '图片',
        icon: 'none'
      })
    }
  },

  //删除图片
  deleteImage: function (event) {
    var index = event.currentTarget.dataset.idx;
    this.data.upImgs.splice(index, 1);
    this.setData({
      upImgs: this.data.upImgs
    });
  },

  formSubmit(e) {
    var that = this
    var upImgs = that.data.upImgs;
    var text = e.detail.value.textarea;
    if (!text || !upImgs[0]) {
      wx.showToast({
        title: '你还没有输入内容哦',
        icon: 'none'
      })
    } else {
      var user = wx.getStorageSync('userInfo')
      db.collection('advice').add({
        data: {
          img: upImgs,
          text: text,
          url: user.avatarUrl,
          name: user.nickName,
          time: util.formatTime(new Date()),
        },
        success(res) {
          wx.showToast({
            title: '提交成功！',
          })
          that.setData({
            value: '',
            upImgs: []
          })
        },
        fail(err) {
          wx.showToast({
            title: '网络异常，请稍后重试',
            icon: 'none'
          })
        }
      })
    }
  },
})