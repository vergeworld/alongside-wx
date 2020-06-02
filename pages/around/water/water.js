const db = wx.cloud.database();
const util = require("../../../utils/util.js");
const log = require("../../../js/not_logged.js")
Page({
  data: {},

  onLoad: function () {
    var that = this
    that.system()
    let openId = wx.getStorageSync('openId')
    if (!openId) {
      log.not_logged(function (res) {})
    } else {
      let receiver = wx.getStorageSync('receiver')
      let phone = wx.getStorageSync('phone')
      let site = wx.getStorageSync('site')
      db.collection("_swiper").get({
        success(res) {
          var notice = res.data[0].around.water.notice
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
          screen_height: res.windowHeight - 320
        })
      },
    })
  },

  formSubmit(e) {
    wx.showLoading({
      title:'正在处理...'
    })
    var that = this
    var v = e.detail.value;
    var openId = wx.getStorageSync('openId')
    if (!openId) {
      wx.showToast({
        title: '亲！你还没有登陆~',
        icon: 'none'
      })
    } else {
      if (!v.input0 || !v.input1 || !v.input2) {
        wx.showModal({
          title: '提示',
          content: '信息填写不完整哦！',
        })
      } else {
        db.collection('water').add({
          data: {
            name: v.input0,
            phone: v.input1,
            address: v.input2,
            time: util.formatTime(new Date())
          },
          success(src) {
            wx.hideLoading()
            console.log('-------->', )
            if (v.input2.length == 6) {
              var num = v.input2[3]
              if (num<3) {
              var fee = 200;
                that.pay(fee)
              } else {
              var  fee = (num-2)*0.5*100+200
              that.pay(fee)
              }
            } else {
              wx.showModal({
                showCancel:false,
                content: '配送地址格式错误！',
              })
            }
          },fail(){
            wx.hideLoading()
          }
        })
      }
    }
  },

  pay(fee) {
    var body = '送水驿站';
    var timestamp = Math.round(new Date());
    wx.cloud.callFunction({
      name: 'pay',
      data: {
        body: body,
        fee: fee,
        order: timestamp,
      },
      success(res) {
        var payData = res.result;
        wx.requestPayment({
          timeStamp: payData.timeStamp,
          nonceStr: payData.nonceStr,
          package: payData.package,
          signType: 'MD5',
          paySign: payData.paySign,
          success(res) {},
          fail(res) {}
        })
      },
      fail(err) {
        wx.showToast({
          title: '支付失败',
        })
      }
    })
  },

  format: function () {
    wx.navigateTo({
      url: '../../around/water/format/format',
    })
  },
  service() {
    wx.navigateTo({
      url: '../../my/service/service',
    })
  }
})