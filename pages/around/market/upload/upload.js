//index.js
//获取应用实例
const db = wx.cloud.database();
const util = require("../../../../utils/util.js");
const log = require('../../../../js/not_logged.js')
var up = require('../../../../js/compressed.js')
Page({

  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    sendMoreMsgFlag: false,
    deleteIndex: -1,
    currentAudio: '',
    ons: []
  },
  onShow() {
    let userName = wx.getStorageSync('name')
    if (!userName) {
      log.not_logged(function (res) {})
    }
  },


  // 选择并上传图片
  chooseImage(event) {
    var num = 1;
    var route = 'around/market/';
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
    // console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var va = e.detail.value;
    if (!va.input1 || !va.input2 || !va.textarea || !img[0]) {
      wx.showModal({
        title: '提示',
        content: '信息必须要完整哦！',
      })
    } else {
      db.collection('market').add({
        data: {
          name: wx.getStorageSync('name'),
          url: wx.getStorageSync('img'),
          time: util.formatTime(new Date()),
          qq: va.input0,
          goods_name: va.input1,
          miaos: va.textarea,
          price: va.input2,
          img: img
        },
        success: res => {
          wx.showToast({
            title: '上传成功！',
          })
          this.setData({
            ons: [],
            value: ''
          })
        },
        fail() {
          wx.showToast({
            title: '上传失败！',
            icon: 'none'
          })
        }
      })
    }
  },
})