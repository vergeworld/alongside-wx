const db = wx.cloud.database();
const log = require("../../../js/not_logged.js")
Page({
  // 页面的初始数据
  data: {

  },
  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    let openId = wx.getStorageSync('openId')
    if (!openId) {
      log.not_logged()
    } else {
      let receiver = wx.getStorageSync('receiver')
      let phone = wx.getStorageSync('phone')
      let site = wx.getStorageSync('site')
      this.setData({
        receiver,
        phone,
        site
      })
    }
  },

  onShow() {
    var openId = wx.getStorageSync('openId')
    if (openId) {
      this.onLoad()
    }
  },

  // 监听用户输入的信息，一旦有内容输入进去，就会使用wx.setStorageSync('userText', value)设置usertext这个key的值，使用wx.getStorageSync('userText')可以得到usertext这个key的值   
  receiver(e) {
    const receiver = e.detail.value
      this.setData({
        receiver
      })
  },

  phone(e) {
    const phone = e.detail.value
    this.setData({
      phone
    })
  },
  site(e) {
    const site = e.detail.value
    this.setData({
      site
    })
  },

  save() {
    var receiver =  this.data.receiver;
    var phone =  this.data.phone;
    var site =  this.data.site;
    var openId = wx.getStorageSync('openId')
    if (!openId) {
      wx.showToast({
        title: '亲！你还没有登陆~',
        icon: 'none'
      })
    } else {
      if (!receiver || !phone || !site) {
        wx.showModal({
          cancelColor: 'cancelColor',
          title: '提示',
          content: '内容填写不完整！'
        })
      } else {
        wx.setStorageSync('receiver', receiver)
        wx.setStorageSync('phone', phone)
        wx.setStorageSync('site', site)
        db.collection('site').get({
          success(res) {
            if (res.data.length == 0) {
              db.collection('site').add({
                data: {
                  receiver: receiver,
                  phone: phone,
                  site: site
                },
                success(res) {
                  wx.showToast({
                    title: '添加成功',
                  })
                },
                fail(res) {
                  wx.showToast({
                    title: '添加失败',
                    icon: 'none'
                  })
                }
              })
            } else {
              var postId = res.data[0]._id
              db.collection('site').doc(postId).update({
                data: {
                  receiver: receiver,
                  phone: phone,
                  site: site
                },
                success(res) {
                  wx.showToast({
                    title: '修改成功',
                  })
                },
                fail(err) {
                  wx.showToast({
                    title: '修改失败',
                    icon: 'none'
                  })
                }
              })
            }
          }
        })
      }
    }
  }
})