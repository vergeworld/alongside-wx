const wxUser = getApp().globalData
const db = wx.cloud.database();
const util = require("../../utils/util.js");
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },

  // 获取用户信息点击登录
  getUserInfo: function (e) {
    let that = this
    wx.getUserProfile({
      desc: '获取用户个人信息',
      success: (res) => {
        let userData = res.rawData
        // let userData = res.userInfo
        wx.showLoading({
          title: '正在登陆...',
        })
        // 获取用户微信公开ID
        wx.cloud.callFunction({
          name: 'getOpenid',
          success(res) {
            var openId = res.result.openid;
            // 查询用户是否存在
            db.collection('user').where({
              _openid: openId
            }).get({
              success(res) {
                // 判断返回结果是否为空
                if (res.data[0]) {
                  wx.setStorageSync('userInfo', res.data[0]);
                  wx.setStorageSync('userStatus', 1); // 0：未登录 1：登录
                  wx.setStorageSync('isReloadHome', true)
                  wx.navigateBack()
                } else {
                  that.onRegister(userData, openId)
                }
              },
              fail() {
                wx.hideLoading()
              },
            })
          },
          fail(err) {
            wx.hideLoading()
            wx.showModal({
              showCancel: false,
              content: '网络出错，请重新登陆！'
            })
          }
        })
      },
      fail: (res) => {
        wx.showToast({
          title: '信息授权失败~',
          duration: 1000,
          icon: 'error',
          mask: true
        })
        wx.navigateBack()
      }
    })
  },

  onRegister(userData, openId) {
    userData = JSON.parse(userData)
    let id = 'verge' + Math.round(new Date()); //用户id
    let nickName = '新人用户' //用户名
    let avatarUrl = userData.avatarUrl //用户头像
    let gender = '' //用户性别
    let phone = '' //电话
    let label = '' //签名
    let address = { //地址
      value: [], //地区名称
      code: [] //地区编号
    } 
    let time = util.formatTime(new Date()) //创建时间
    db.collection("user").add({
      data: {
        _id: id,
        nickName,
        avatarUrl,
        gender,
        phone,
        label,
        address,
        time
      },
      success() {
        let user = {
          _id: id,
          _openid: openId,
          nickName,
          avatarUrl,
          gender,
          phone,
          label,
          address,
          time
        }
        wx.setStorageSync('userInfo', user);
        wx.redirectTo({
          url: './../my/person/person',
        })
        wx.setStorageSync('userStatus', 1); // 0：未登录 1：登录
        wx.setStorageSync('isReloadHome', true)
      },
      complete() {
        wx.hideLoading()
      }
    })
  },


  toProtocol() {
    wx.navigateTo({
      url: '/pages/login/protocol/protocol',
    })
  }
})