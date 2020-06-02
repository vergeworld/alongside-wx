var util = require("../../../../utils/util.js");
const db = wx.cloud.database();
const _ = db.command;
let number = 0;
let zong = 0;
Page({
  data: {
    postList: [],
    not_log: false,
    not_net: false,
    not_order: false
  },
  // 生命周期函数--监听页面加载
  onLoad() {
    var that = this
    var openId = wx.getStorageSync('openId')
    if (!openId) {
      that.setData({
        not_log: true,
      })
    } else {
      db.collection('shop_car').get({
        success(res) {
          var postList = res.data
          if (postList[0]) {
            that.setData({
              postList,
              openId,
            })
            that.figure()
          } else {
            that.setData({
              not_order: true
            })
          }
        },
        fail() {
          that.setData({
            not_net: true
          })
        }
      })
    }
  },

  figure() {
    zong = 0;
    number = 0;
    let postList = this.data.postList
    for (let i = 0; i < postList.length; i++) {
      let price = postList[i].price;
      let num = postList[i].number;
      number = num + number
      zong = price * num + zong;
    }
    if (zong >= 10) {
      this.setData({
        zong,
        tip: 0,
        number
      })
    } else {
      zong = (zong+2).toFixed(1);
      this.setData({
        zong,
        tip: 2,
        number
      })
    }

  },

  more(e) {
    var that = this
    var postId = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    var postList = that.data.postList;
    wx.showActionSheet({
      itemList: ['删除'],
      itemColor: 'red',
      success(res) {
        if (res.tapIndex == 0) {
          wx.showModal({
            title: '提示',
            content: '确定删除此订单记录？',
            success: function (res) {
              if (res.confirm) {
                postList.splice(index, 1);
                db.collection('shop_car').doc(postId).remove({
                  success: res => {
                    wx.showToast({
                      title: '删除成功',
                      duration: 2000
                    })
                    that.figure()
                    if (postList[0]) {
                      that.setData({
                        postList
                      });
                    } else {
                      that.setData({
                        postList,
                        not_order: true
                      })
                    }

                  },
                  fail: function (res) {
                    wx.showToast({
                      title: "删除失败",
                      duration: 2000
                    })
                  }
                })
              }
            }
          })
        }
      }
    })
  },

  //数量累计
  add: function (e) {
    let postList = this.data.postList
    let id = e.currentTarget.dataset.id
    let index = e.currentTarget.dataset.index
    let number = postList[index].number
    postList[index].number = (number + 1)
    db.collection('shop_car').doc(id).update({
      data: {
        number: _.inc(1)
      },fail(err){
        console.log(err)
      }
    })
    this.setData({
      postList
    })
    this.figure()
  },

  cut: function (e) {
    let postList = this.data.postList
    let id = e.currentTarget.dataset.id
    let index = e.currentTarget.dataset.index
    let number = postList[index].number
    if (number > 1) {
      postList[index].number = (number - 1)
      db.collection('shop_car').doc(id).update({
        data: {
          number: _.inc(-1)
        }
      })
    }
    this.setData({
      postList
    })
    this.figure()
  },


  submit() {
    wx.showLoading({
      title: '正在处理...',
    })
    var that = this
    let receiver = wx.getStorageSync('receiver')
    let phone = wx.getStorageSync('phone')
    let site = wx.getStorageSync('site')
    if (!receiver || !phone || !site) {
      wx.hideLoading()
      wx.showModal({
        cancelColor: 'cancelColor',
        title: '提示',
        content: '请填写收货地址'
      })
    } else {
      wx.hideLoading()
      var postList = this.data.postList
      for (let i = 0; i < postList.length; i++) {
        var post = postList[i]
        db.collection('order').add({
          data: {
            img: post.img,
            name: post.name,
            number: post.number,
            price: post.price,
            taste: post.taste,
            receiver: receiver,
            phone: phone,
            site: site,
            time: util.formatTime(new Date()),
          },
          success: res => {
            db.collection('myOrder').add({
              data: {
                img: post.img,
                name: post.name,
                number: post.number,
                price: post.price,
                taste: post.taste,
                time: util.formatTime(new Date()),
              }
            })
          }
        })
      }
      that.pay()
    }
  },

  pay() {
    var that = this;
    var body = '零食铺子';
    var fee = this.data.zong
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
          success(res) {
            wx.cloud.callFunction({
              name: 'removeCar',
            })
            that.setData({
              postList: null,
              price: 0,
              else: 1,
              not_order: true,
            })
          }
        })
      },
      fail(err) {
        wx.showToast({
          title: '支付失败',
        })
      }
    })
  },

  site() {
    wx.navigateTo({
      url: '../../../my/site/site',
    })
  }
})