const db = wx.cloud.database();
var nickName
var avatarUrl
var openId
var gender
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  // 获取用户信息点击登录
  getUserInfo: function (e) {
    var that = this
    wx.showLoading({
      title: '正在登陆...',
    })
    wx.cloud.callFunction({
      name: 'getOpenid',
      success(res) {
        var openId = res.result.openid;
        db.collection('user').where({
          _openid: openId
        }).get({
          success(res) {
            var user = res.data[0]
            wx.setStorageSync('openId', openId);
            if (res.data[0]) {
              var id = user._id;
              var img = user.url;
              var name = user.name;
              var gender = user.gender;
              var school = user.school;
              var label = user.label;
              wx.setStorageSync('id', id);
              wx.setStorageSync('name', name);
              wx.setStorageSync('img', img);
              wx.setStorageSync('gender', gender);
              wx.setStorageSync('school', school);
              wx.setStorageSync('label', label);
              that.get_site()
            } else {
              wx.getSetting({
                success(res) {
                  wx.getUserInfo({
                    success(res) {
                      nickName = res.userInfo.nickName; //用户名
                      avatarUrl = res.userInfo.avatarUrl; //用户头像
                      gender = res.userInfo.gender; //用户性别
                      if (gender == 2) {
                        gender = '女'
                      } else if (gender == 1) {
                        gender = '男'
                      } else {
                        gender = ''
                      }
                      wx.setStorageSync('name', nickName);
                      wx.setStorageSync('img', avatarUrl);
                      wx.setStorageSync('gender', gender);
                      wx.setStorageSync('school', '桂林理工大学·空港校区');
                      wx.setStorageSync('label', '');
                      that.add_account();
                      that.get_site();
                    }
                  })
                }
              })
            }
          }
        })
      },
      fail() {
        wx.showModal({
          confirmColor: 'red',
          showCancel: false,
          content: '登陆失败，请重新登陆。'
        })
      }
    })
},

add_account(){
  db.collection("user").add({
    data: {
      name: nickName,
      url: avatarUrl,
      gender: gender,
      school: '桂林理工大学·空港校区',
      label: '',
      praise: 0,
      comment: 0,
      read: 0
    }
  })
},

  // 获取当前用户地址
  get_site() {
    var receiver = wx.getStorageSync('receiver')
    if (!receiver) {
      db.collection('site').get({
        success(res) {
          var post = res.data[0]
          var receiver = post.receiver
          var phone = post.phone
          var site = post.site
          wx.setStorageSync('receiver', receiver)
          wx.setStorageSync('phone', phone)
          wx.setStorageSync('site', site)
        },complete(){
          wx.hideLoading()
          wx.navigateBack()
        }
      })
    }
  },

  service() {
    wx.navigateTo({
      url: '../my/service/service',
    })
  }
})