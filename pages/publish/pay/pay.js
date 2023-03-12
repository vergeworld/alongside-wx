const db = wx.cloud.database();
const popup = require('../../../js/popup');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    privilege: [{
        time: 24,
        price: 7.0
      },
      {
        time: 48,
        price: 12
      }, {
        time: 72,
        price: 15
      }
    ],
    checkedId: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(e) {
    popup.showModal(this)
    this.setData({
      listData: JSON.parse(e.data), //需要提交的数据
      banner: wx.getStorageSync('source').publish.privilege.banner
    })
  },

  // 付费类型选择
  bindCheck(e) {
    this.setData({
      checkedId: e.currentTarget.dataset.idx,
    })
  },

  submit() {
    wx.showLoading()
    let dt = this.data
    let data = dt.listData
    let idx = dt.checkedId
    let fee = dt.privilege[idx].price * 100
    let privilegeTime = dt.privilege[idx].time * 60 * 60
    let timestamp = Date.parse(new Date()) / 1000 //获取秒数
    data.timestamp = timestamp
    db.collection('trips').add({
      data,
      success: src => {
        let id = src._id
        wx.cloud.callFunction({
          name: 'pay', //云函数名称
          data: {
            fee: fee,
            outTradeNo: id
          },
          success: res => {
            wx.hideLoading()
            const payment = res.result
            console.log(res);
            wx.requestPayment({
              ...payment,
              success(res) {
                db.collection('trips').where({
                  _id: id
                }).update({
                  data: {
                    is_delete: 1,
                    privilege: 1, //添加特权  0：无，1：顶置，2：代发
                    sequence: privilegeTime + timestamp
                  }
                })
                wx.showToast({
                  title: '提交成功',
                })
                wx.setStorageSync('payDone', 1)
                wx.navigateBack({
                  delta: 0,
                })
              },
              fail(err) {
                console.log(err);

                wx.showToast({
                  icon: 'none',
                  title: '支付失败',
                })
              }
            })
          },
          fail: err => {
            wx.showToast({
              title: '网络异常，请稍后重试！',
              icon: 'none'
            })
          }
        })
      },
      fail: err => {
        console.log(err);
        wx.showToast({
          title: '异常,请稍后重试~',
          icon: 'none'
        })
      }
    })
  }
})