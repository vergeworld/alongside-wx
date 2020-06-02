const db = wx.cloud.database();
const util = require("../../../utils/util.js");
const log = require("../../../js/not_logged.js")
Page({
  data: {},

  // 页面渲染
  onLoad: function () {
    this.system()
    var that = this
    let openId = wx.getStorageSync('openId')
    if (!openId) {
      log.not_logged(function (res) {})
    } else {
      db.collection('_swiper').get({
        success(res) {
          var notice = res.data[0].around.package.notice
          let receiver = wx.getStorageSync('receiver')
          let phone = wx.getStorageSync('phone')
          let site = wx.getStorageSync('site')
          that.setData({
            notice,
            receiver,
            phone,
            site
          })
        }
      })
    }
  },

  onShow() {
    var openId = wx.getStorageSync('openId')
    if (openId) {
      this.onLoad()
    }
  },

  // 获取屏幕高度
  system() {
    var that = this
    wx.getSystemInfo({
      complete: (res) => {
        that.setData({
          screen_height: res.windowHeight - 455
        })
      },
    })
  },

  formSubmit(e) {
    var v = e.detail.value;
    var openId = wx.getStorageSync('openId')
    if (!openId) {
      wx.showToast({
        title: '亲！你还没有登陆~',
        icon: 'none'
      })
    } else {
      if (!v.input0 || !v.input1 || !v.input2 || !v.input3 || !v.input4) {
        wx.showModal({
          title: '提示',
          content: '信息填写不完整哦！',
        })
      } else {
        db.collection('express').add({
          data: {
            name: v.input0,
            phone: v.input1,
            address: v.input2,
            express: v.input3,
            number: v.input4,
            remarks: v.input5,
            type:'',
            status:'等待配送',
            time: util.formatTime(new Date())
          },
          success: src => {
            wx.showToast({
              title: '提交成功',
            })
            this.setData({
              value: ''
            })
          },
          fail(err) {
            wx.showToast({
              title: '提交失败！',
              icon: 'none'
            })
          }
        })
      }
    }
  },
  
  format: function () {
    wx.navigateTo({
      url: '../../around/package/format/format',
    })
  },
  service() {
    wx.navigateTo({
      url: '../../my/service/service',
    })
  }
})