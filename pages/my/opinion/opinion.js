var util = require("../../../utils/util.js");
const log = require('../../../js/not_logged.js')
var sy = require('../../../js/system.js')
var up = require('../../../js/compressed.js')
const db = wx.cloud.database();
Page({
  data: {
    sendMoreMsgFlag: false,
    chooseFiles: [],
    chooseVideo: [],
    deleteIndex: -1,
    currentAudio: '',
    commentList: [],
    ons: []
  },
  //事件处理函数
  onLoad: function () {
    sy.system(446, this)
    var openId = wx.getStorageSync('openId');
    var name = wx.getStorageSync('name');
    var url = wx.getStorageSync('img')
    if (!openId) {
      log.not_logged(function (res) {})
    } else {
      this.setData({
        url,
        name
      })
    }
  },

  onShow() {
    var openId = wx.getStorageSync('openId')
    if (openId) {
      this.onLoad()
    }
  },

  //选择本地照片与拍照
  chooseImage(event) {
    var num = 4
    var route = 'opinion/'
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
    var that = this
    var ons = that.data.ons;
    var text = e.detail.value.textarea;
    if (!text && !ons[0]) {
      wx.showToast({
        title: '你还没有输入内容哦',
        icon: 'none'
      })
    } else {
      db.collection('opinion').add({
        data: {
          img: ons,
          name: wx.getStorageSync('name'),
          url: wx.getStorageSync('img'),
          time: util.formatTime(new Date()),
          text: text,
        },
        success(res) {
          wx.showToast({
            title: '提交成功！',
          })
          that.setData({
            value: '',
            ons: []
          })
        },
        fail(err) {
          wx.showToast({
            title: '提交失败',
            icon: 'none'
          })
        }
      })
    }
  },
})