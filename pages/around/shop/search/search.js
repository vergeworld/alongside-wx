const db = wx.cloud.database();
Page({
  data: {
    inputVal: '',
    show: false,
    page: 0,
  },

  // 输入框监控
  input: function (e) {
    var inputVal = e.detail.value
    if (!inputVal) {
      this.setData({
        postList: [],
        show: false,
        inputVal: ''
      })
    } else {
      this.setData({
        inputVal,
        show: false,
        page: 0,
      })
    }
  },
  clearInput: function () {
    this.setData({
      inputVal: "",
      postList: [],
      show: false,
      page: 0,
    });
  },
  confirmTap: function (e) {
    var value = this.data.inputVal;
    wx: wx.showLoading({
      title: '正在搜索...'
    })
    if (!value) {
      this.setData({
        show: true
      })
      wx.hideLoading();
    } else {
      db.collection('shop')
        .where({
          name: db.RegExp({
            regexp: value, //miniprogram做i为关键字进行匹配
            options: 'i', //不区分大小写
          })
        })
        .get({
          success: res => {
            var postList = res.data;
            if (postList.length > 0) {
              this.setData({
                postList: res.data
              })
            } else {
              this.setData({
                show: true
              })
            }
            wx.hideLoading();
          }
        })
    }
  },

  // 加入购物车
  add(e) {
    var that = this
    const _ = db.command
    var postId = e.currentTarget.dataset.id
    var openId = wx.getStorageSync('openId')
    if (!openId) {
      wx.showToast({
        title: '亲！您还没有登陆~~',
        icon: 'none'
      })
    } else {
      wx.cloud.callFunction({
        name: 'shop',
        data: {
          postId: postId
        },
        success: res => {
          var list = res.result.data
          if (!list[0]) {
            that.add_car()
          } else {
            db.collection('shop_car').doc(list[0]._id).update({
              data: {
                number: _.inc(1)
              },
              success: res => {
                wx.showToast({
                  title: '添加成功',
                })
              }
            })
          }
        },
        fail(err) {
          wx.showToast({
            title: '添加失败',
            icon: 'none'
          })
        }
      })
    }
  },

  // 增加新订单
  add_car() {
    var post = this.data.postList[0]
    db.collection('shop_car').add({
      data: {
        img: post.img[0],
        name: post.name,
        price: post.price,
        taste: post.taste,
        postId: post._id,
        number: 1
      },
      success: res => {
        wx.showToast({
          title: '添加成功',
        })
      }
    })
  },

  // 页面下拉加载刷新
  onReachBottom: function (res) {
    var that = this
    var value = that.data.inputVal;
    var page = that.data.page + 20;
    db.collection('shop').where({
      name: db.RegExp({
        regexp: value, //miniprogram做i为关键字进行匹配
        options: 'i', //不区分大小写
      })
    }).skip(page).get().then(res => {
      let new_data = res.data
      let old_data = that.data.postList
      let postList = old_data.concat(new_data)
      that.setData({
        postList,
        page
      })
    })
  },

  // 详情页面
  detail(e) {
    var postId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../detail/detail?id=' + postId,
    })
  },
})