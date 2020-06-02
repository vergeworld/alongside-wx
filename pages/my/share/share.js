const db = wx.cloud.database();
const _ = db.command;
const log = require('../../../js/not_logged.js')
var pattern = require('../../../js/img.js')
var sy = require('../../../js/system.js')
var forum = require('../../../js/forum')
var imgW = [];
var imgH = [];
var imgM = [];
Page({
  data: {
    postList: [],
    post: [{
      tiem: 0
    }],
    loadImg: '/images/post/3.3.gif',
    loadTxt: '拼命加载中...',
    hideFlag: true,
    loading: true,
    not_log: false,
    not_share: false,
    share: 0,
    praise: 0,
    top: 0,
    comment: 0,
    read: 0,
    openid: '',
  },

  onLoad: function (options) {
    sy.system(250, this)
    var that = this;
    var openId = wx.getStorageSync('openId')
    if (!openId) {
      log.not_logged()
      that.setData({
        loading: false,
        not_log: true
      })
    } else {
      var img = wx.getStorageSync('img');
      var name = wx.getStorageSync('name');
      var label = wx.getStorageSync('label')
      var openid = wx.getStorageSync('openId')
      db.collection("forum").where({
        _openid: openid
      }).orderBy('time', 'desc').get({
        success(res) {
          var postList = res.data;
          var post = res.data;
          pattern.img(postList, 0, imgW, imgH, imgM, that)
          that.setData({
            postList,
            post,
            page: 0,
            name,
            img,
            label,
          })
          if (postList.length == 0) {
            that.setData({
              not_share: true,
              loading: false,
              not_log: false
            })
          } else {
            that.getData(openId, postList)
            that.setData({
              loading: false,
              not_log: false,
              not_share: false,
            })
            for (let i = 0; i < postList.length; i++) {
              var postId = postList[i]._id
              db.collection('forum_dz').where({
                postId: postId
              }).get({
                success(res) {
                  if (res.data[0]) {
                    postList[i].hasChange = true
                    that.setData({
                      postList
                    })
                  }
                }
              })
            }
          }
        },
        fail(err) {
          that.setData({
            loading: true,
            loadImg: '/images/post/3.4.png',
            loadTxt: '网络似乎出了点问题~'
          })
        }
      })
    }
  },

  //页面事件监控
  onShow() {
    var that = this
    if (that.data.top < 10) {
      var openId = wx.getStorageSync('openId')
      if (openId) {
        this.onLoad()
      }
    }
  },


  getData(openId, postList) {
    var that = this
    var name = postList[0].name;
    var img = postList[0].url;
    var share = postList.length;
    db.collection('user').where({
      _openid: openId
    }).get({
      success(res) {
        var data = res.data[0]
        that.setData({
          postList,
          name,
          img,
          share,
          label: data.label,
          praise: data.praise,
          comment: data.comment,
          read: data.read,
        })
      }
    })
  },

  // 页面下拉加载刷新
  onReachBottom: function (res) {
    wx.showLoading({
      title: '加载中...',
    })
    var that = this
    let page = that.data.page + 20;
    var openid = wx.getStorageSync('openId')
    db.collection('forum').where({
      _openid: openid
    }).orderBy('time', 'desc').skip(page).get({
      success: res => {
        var new_data = res.data
        if (new_data.length == 0) {
          that.setData({
            no_more: 1
          })
        } else {
          pattern.img(new_data, page, imgW, imgH, imgM, that)
          var old_data = that.data.postList;
          var postList = old_data.concat(new_data)
          that.setData({
            postList,
            page
          })
            for (let i = 0; i < new_data.length; i++) {
              var j = i + page;
              var postId = postList[j]._id
              db.collection('forum_dz').where({
                postId: postId
              }).get({
                success(res) {
                  if (res.data[0]) {
                    postList[j].hasChange = true
                    that.setData({
                      postList
                    })
                  }
                }
              })
            }
        }
      },
      fail() {
        wx.showToast({
          title: '加载失败...',
          icon: 'none'
        })
      },
      complete(res) {
        wx.hideLoading()
      }
    })
  },

  //轮播图点击预览
  preview: function (e) {
    var postList = this.data.postList
    pre.preview(e, postList)
  },

  //阅读数量累计
  read: function (e) {
    forum.read(e)
  },

  //点赞数量累计
  like: function (e) {
    var postList = this.data.postList;
    forum.praise(e, postList, this)
  },

  // 更多（删除）
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
            content: '确定删除该分享内容？',
            success: function (res) {
              if (res.confirm) {
                postList.splice(index, 1);
                imgW.splice(index, 1)
                imgH.splice(index, 1)
                imgM.splice(index, 1)
                db.collection('forum').doc(postId).remove({
                  success: function (res) {
                    wx.showToast({
                      title: '删除成功',
                      duration: 2000
                    })
                    that.setData({
                      postList,
                      imgW,
                      imgH,
                      imgM
                    })
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

  //转发
  onShareAppMessage: function (res) {
    var postId = res.target.dataset.id
    var index = res.target.dataset.index
    var img = this.data.postList[index].img[0];
    var txt = this.data.postList[index].text;
    return {
      title: '#' + txt,
      desc: this.data.postList[index].text,
      path: '/pages/forum/comment/comment?id=' + postId,
      imageUrl: img,
    }
  },

  // 页面高度监控
  onPageScroll(e) {
    forum.scroll(e, this)
  },

  upload() {
    wx.navigateTo({
      url: '../../forum/share/share',
    })
  },

  // 评论链接
  comment: function (e) {
    var postId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../forum/comment/comment?id=' + postId,
    })
  },

  // 返回链接
  back: function () {
    wx.navigateBack({
      url: '../my',
    })
  },
})