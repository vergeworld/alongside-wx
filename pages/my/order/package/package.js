const db = wx.cloud.database();
Page({
  data: {
    page: 0,
    postList: [],
    not_log: false,
    not_net: false,
    not_order: false
  },
  onLoad: function (options) {
    var that = this;
    let openId = wx.getStorageSync('openId')
    if (openId) {
      db.collection("express").where({
        _openid: openId
      }).orderBy('time', 'desc').get({
        success(res) {
          if (res.data.length == 0) {
            that.setData({
              not_order: true
            })
          } else {
            that.setData({
              postList: res.data,
              page: 0
            })
          }
        },
        fail(err) {
          that.setData({
            not_net: true,
            loadImg: '/images/post/3.4.png',
            loadTxt: '网络似乎出了点问题~'
          })
        }
      })
    } else {
      that.setData({
        not_log: true
      })
      wx.showToast({
        title: '亲！您还没有登陆哦~',
        icon: 'none',
        duration: 2000
      })
    }
  },
  // 页面监控
  onShow: function () {
    this.onLoad();
  },
  // 页面下拉加载刷新
  onReachBottom: function (res) {
    var that = this
    let page = that.data.page + 20;
    let openId = wx.getStorageSync('openId')
    db.collection('myexpress').where({
      _openid: openId
    }).orderBy('time', 'desc').skip(page).get().then(res => {
      let new_data = res.data
      let old_data = that.data.postList
      let postList = old_data.concat(new_data)
      that.setData({
        postList,
        page
      })
    })
  },

  more(e) {
    let that = this
    var id = e.currentTarget.dataset.id;
    var postList = that.data.postList;
    var index = e.currentTarget.dataset.index;
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
                postList.splice(index, 1)
                db.collection('myexpress').doc(id).remove({
                  success: function (res) {
                    wx.showToast({
                      title: '删除成功',
                      duration: 2000
                    })
                  },
                  fail: function (res) {
                    wx.showToast({
                      title: "删除失败",
                      duration: 2000
                    })
                  }
                })
              } else if (res.cancel) {
                return false;
              }
              that.setData({
                postList
              });
            }
          })
        }
      }
    })
  },

  kd() {
    wx.navigateTo({
      url: '../../../around/package/package',
    })
  },

  detail(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../package/detail/detail?id=' + id,
    })
  },

  cancel(e) {
    let that = this
    var postList = that.data.postList;
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '提示',
      content: '是否取消订单？',
      success: function (res) {
        if (res.confirm) {
          postList.splice(index, 1)
          db.collection('myexpress').doc(id).remove({
            success: function (res) {
              wx.showToast({
                title: '删除成功',
                duration: 2000
              })
            },
            fail: function (res) {
              wx.showToast({
                title: "删除失败",
                duration: 2000
              })
            }
          })
        } else if (res.cancel) {
          return false;
        }
        that.setData({
          postList
        });
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})