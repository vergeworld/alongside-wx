const db = wx.cloud.database();
Page({
  data: {
    inputVal: '',
    show: false,
    page: 0
  },
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
      title: '加载中...'
    })
    if (!value) {
      this.setData({
        show: true
      })
      wx.hideLoading();
    } else {
      db.collection('books')
        .where({
          book: db.RegExp({
            regexp: value, //miniprogram做i为关键字进行匹配
            options: 'i', //不区分大小写
          })
        }).orderBy('time', 'desc').get({
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

  // 页面下拉加载刷新
  onReachBottom: function (res) {
    var that = this
    var value = that.data.inputVal;
    let page = that.data.page + 20;
    db.collection('books').where({
      book: db.RegExp({
        regexp: value, //miniprogram做i为关键字进行匹配
        options: 'i', //不区分大小写
      })
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

  detail(e) {
    let postId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../detail/detail?id=' + postId,
    })
    const _ = db.command
    db.collection('books').doc(postId).update({
      data: {
        read: _.inc(1)
      }
    })
  },
})