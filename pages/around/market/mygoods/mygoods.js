const db = wx.cloud.database();
var forum = require('../../../../js/forum');
var openId
Page({
  data: {
    hideFlag: true,
    postList: [],
    loadImg: '/images/post/3.3.gif',
    loadTxt: '拼命加载中...',
    top: 0,
    openid: '',
    not_log: false,
    not_order: false,
    show: false
  },

  onLoad: function () {
    var that = this;
    openId = wx.getStorageSync('openId')
    if (!openId) {
      that.setData({
        not_log: true,
        loadImg: '/images/post/3.4.png',
        loadTxt: '亲！您还没有登陆哦~'
      })
    } else {
      db.collection('market').orderBy('time', 'desc').where({
        _openid: openId
      }).get({
        success(res) {
          if (res.data[0]) {
            that.setData({
              postList: res.data,
              not_order: false,
              page: 0
            })
          } else {
            that.setData({
              not_order: true
            })
          }

        },
        fail(err) {
          that.setData({
            loadImg: '/images/post/3.4.png',
            loadTxt: '网络似乎出了点问题~'
          })
        }
      })
    }
  },


  // 页面高度监控
  onPageScroll(e) {
    forum.scroll(e, this)
  },


  //下拉加载数据
  onReachBottom: function (res) {
    var that = this
    wx.showLoading({
      title: '正在加载...',
    })
    let page = that.data.page + 20;
    db.collection('market').orderBy('time', 'desc').skip(page).where({
      _openid: openId
    }).get().then(res => {
      let new_data = res.data
      if (new_data.length == 0) {
        wx.showToast({
          title: '就这么多啦！',
          icon: 'none'
        })
        that.setData({
          show: true
        })
        wx.hideLoading()
      } else {
        let old_data = that.data.postList
        let postList = old_data.concat(new_data)
        that.setData({
          postList,
          page
        })
        wx.hideLoading()
      }
    })
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
                db.collection('market').doc(postId).remove({
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

  //轮播图点击预览
  preview: function (e) {
    var i = e.currentTarget.id
    console.log('i=' + i)
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

  detail(e) {
    var postId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../../market/detail/detail?id=' + postId,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {}
})