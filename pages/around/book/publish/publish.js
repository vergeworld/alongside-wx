//index.js
//获取应用实例
var util = require("../../../../utils/util.js");
var log = require('../../../../js/not_logged.js')
var up = require('../../../../js/compressed.js')
const db = wx.cloud.database();
Page({
  data: {
    sendMoreMsgFlag: false,
    deleteIndex: -1,
    currentAudio: '',
    commentList: [],
    ons: [],
    name: '',
    url: ''
  },

  onLoad() {
    let name = wx.getStorageSync('name')
    if (!name) {
      log.not_logged(function (res) {})
    }
    let url = wx.getStorageSync('img')
    this.setData({
      name,
      url,
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
    var num = 1;
    var route = 'around/books/';
    var ons = this.data.ons;
    up.chooseImage(event, ons, num, route, this)
  },

  //删除已经选择的图片
  deleteImage: function (event) {
    var index = event.currentTarget.dataset.idx,
      that = this;
    that.setData({
      deleteIndex: index
    });
    that.data.ons.splice(index, 1);
    setTimeout(function () {
      that.setData({
        deleteIndex: -1,
        ons: that.data.ons
      });
    }, 500)
  },

  formSubmit(e) {
    var ons = this.data.ons
    console.log(ons)
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var v = e.detail.value;
    if (!v.input0 || !v.input1 || !v.input2 || !v.textarea || !ons[0]) {
      wx.showModal({
        title: '提示',
        content: '内容不得为空！',
      })
    } else {
      db.collection('books').add({
        data: {
          img: ons,
          name: this.data.name,
          url: this.data.url,
          book: v.input0,
          author: v.input1,
          classics: v.input2,
          reason: v.textarea,
          read: 0,
          comment: 0,
          commentList: [],
          time: util.formatTime(new Date()),
        },
        success: res => {
          wx.showToast({
            title: '发表成功！',
            icon: 'none'
          })
          this.setData({
            ons: [],
            value: ''
          })
        },
        fail(err) {
          wx.showToast({
            title: '发表失败！',
            icon: 'none'
          })
        }
      })
    }
  },
})