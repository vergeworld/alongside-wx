const db = wx.cloud.database();
const util = require("../../../utils/util.js");
const log = require("../../../js/not_logged.js")
Page({
  onLoad() {
    var img = wx.getStorageSync('img')
    if (!img) {
      log.not_logged(function (res) {})
    }
    this.system()
  },

  system() {
    wx.getSystemInfo({
      complete: (res) => {
        console.log(res)
        this.setData({
          screen_height: res.windowHeight - 490
        })
      },
    })
  },

  formSubmit(e) {
    var a = e.detail.value;
    var openId = wx.getStorageSync('openId')
    if (!openId) {
      wx.showToast({
        title: '亲！你还没有登陆~', 
        icon: 'none'
      })
    } else {
      if (!a.occupation || !a.address || !a.name || !a.title || !a.phone || !a.time || !a.content || !a.wages || !a.number) {
        wx.showModal({
          title: '提示',
          content: '信息必须完整哦！',
        })
      } else {
        db.collection('job').add({
          data: {
            title: a.title,
            occupation: a.occupation,
            number: a.number,
            content: a.content,
            data: a.time,
            wages: a.wages,
            name: a.name,
            phone: a.phone,
            address: a.address,
            img: wx.getStorageSync('img'),
            time: util.formatTime(new Date()),
            read: 0
          },
          success: res => {
            wx.showToast({
              title: '提交成功！',
            })
            this.setData({
              value: ''
            })
          },
          fail: res => {
            wx.showToast({
              title: '提交失败！',
              icon: 'none',
            })
          }
        })
      }
    }
  },
  announce() {
    wx.navigateTo({
      url: '../publish/announce/announce',
    })
  }
})