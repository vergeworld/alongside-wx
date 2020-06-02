//index.js
//获取应用实例
var util = require("../../../utils/util.js");
const log = require("../../../js/not_logged.js")
const up = require('../../../js/compressed.js')
const db = wx.cloud.database();
Page({
  data: {
    deleteIndex: -1,
    currentAudio: '',
    commentList: [],
    ons: [],
    name: '',
    url: '',
  },

  // 页面初次渲染
  onLoad() {
    var that = this;
    let name = wx.getStorageSync('name')
    let url = wx.getStorageSync('img')
    let openId = wx.getStorageSync('openId')
    if (!openId) {
      log.not_logged()
    } else {
      db.collection('_swiper').get({
        success(res){
        var  placeholder = res.data[0].forum.placeholder
        that.setData({
          name,
          url,
          placeholder,
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

  chooseImage(event) {
    var num = 9;
    var route = 'forum/';
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
    that.setData({
      deleteIndex: -1,
      ons: that.data.ons
    });
  },

  formSubmit(e) {
    var ons = this.data.ons
    var text = e.detail.value.textarea;
    var openId = wx.getStorageSync('openId')
    if (!openId) {
      wx.showToast({
        title: '亲！你还没有登陆~',
        icon: 'none'
      })
    } else {
      if (!text && !ons[0]) {
        wx.showModal({
          title: '提示',
          content: '内容不得为空！',
        })
      } else {
        db.collection('forum').add({
          data: {
            img: ons,
            name: this.data.name,
            url: this.data.url,
            time: util.formatTime(new Date()),
            text: text,
            read: 0,
            like: 0,
            comment: 0,
            address: '桂林理工大学，空港校区',
            zf: 0,
            commentList: this.data.commentList,
            hasChange: false
          },
          success: res => {
            wx.showToast({
              title: '分享成功！',
            })
            this.setData({
              ons: [],
              value: ''
            })
          },
          fail: err => {
            wx.showToast({
              title: '分享失败！',
            })
          }
        })
      }
    }
  },
})