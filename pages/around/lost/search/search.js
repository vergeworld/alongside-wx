const db = wx.cloud.database();
var pattern = require('../../../../js/img.js');
var imgWidth = [];
var imgHeight = [];
var mode = [];
Page({
  data: {
    postList: [],
    imgWidth: [],
    imgHeight: [],
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
    var page = this.data.page;
    wx: wx.showLoading({
      title: '正在搜索...'
    })
    if (!value) {
      this.setData({
        show: true
      })
      wx.hideLoading();
    } else {
      db.collection('lost')
        .where({
          content: db.RegExp({
            regexp: value, //miniprogram做i为关键字进行匹配
            options: 'i', //不区分大小写
          })
        }).orderBy('time', 'desc').get({
          success: res => {
            var postList = res.data;
            pattern.img(postList, page, imgWidth, imgHeight, mode, this);
            wx.hideLoading();
            if (postList.length > 0) {
              this.setData({
                postList: res.data
              })
            } else {
              this.setData({
                show: true
              })
            }
          }
        })
    }
  },
  //轮播图点击预览
  preview: function (e) {
    var i = e.currentTarget.id
    var that = this;
    var postList = that.data.postList
    var src = e.currentTarget.dataset.src; //获取data-src
    var imgList = postList[i].img; //获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },

  // 页面下拉加载刷新
  onReachBottom: function (res) {
    var that = this
    var value = that.data.inputVal;
    let page = that.data.page + 20;
    db.collection('lost').where({
      content: db.RegExp({
        regexp: value, //miniprogram做i为关键字进行匹配
        options: 'i', //不区分大小写
      })
    }).orderBy('time', 'desc').skip(page).get().then(res => {
      let new_data = res.data
      pattern.img(new_data, page, imgWidth, imgHeight, mode, that);
      let old_data = that.data.postList
      let postList = old_data.concat(new_data)
      that.setData({
        postList,
        page
      })
    })
  },
})