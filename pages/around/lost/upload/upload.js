//index.js
//获取应用实例
const app = getApp()
const db = wx.cloud.database();
const util = require("../../../../utils/util.js")
const log = require('../../../../js/not_logged.js')
const up = require('../../../../js/compressed.js')
Page({
  data: {
    userInfo: {},
    deleteIndex: -1,
    currentAudio: '',
    ons: []
  },

  onShow() {
    let userName = wx.getStorageSync('name')
    if (!userName) {
      log.not_logged(function (err) {})
    } else {
      this.onLoad();
    }
  },

  //选择本地照片与拍照
  chooseImage(event) {
    var num = 4;
    var route = 'around/lost/';
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
    var img = this.data.ons;
    var va = e.detail.value;
    if (!va.input || !img[0]) {
      wx.showModal({
        title: '提示',
        content: '信息必须完整哦~',
      })
    } else {
      db.collection('lost').add({
        data: {
          img: img,
          url: wx.getStorageSync('img'),
          name: wx.getStorageSync('name'),
          qq: va.input,
          content: va.textarea,
          time: util.formatTime(new Date())
        },
        success: res => {
          wx.showToast({
            title: '提交成功！',
            icon: 'none'
          })
          this.setData({
            value: '',
            ons: []
          })
        },
        fail(err) {
          wx.showToast({
            title: '提交失败！',
          })
        }
      })
    }
  },

})