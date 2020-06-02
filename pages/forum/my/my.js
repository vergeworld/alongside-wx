const db = wx.cloud.database();
const _ = db.command;
var pattern = require('../../../js/img.js')
var forum = require('../../../js/forum');
var img = require('../../../js/img')
var imgW = [];
var imgH = [];
var imgM = [];
var openId;
var id
Page({
   data: {
      page: 0,
      postList: [],
      loadImg: '/images/post/3.3.gif',
      loadTxt: '拼命加载中...',
   },

   onLoad: function (e) {
      id = e.id
      var that = this
      openId = wx.getStorageSync('openId')
      db.collection('forum').orderBy('time', 'desc').where({
         _openid: id
      }).get({
         success(res) {
            var postList = res.data;
            that.getData(id, postList);
            pattern.img(postList, 0, imgW, imgH, imgM, that)
            if (openId) {
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
               loadImg: '/images/post/3.4.png',
               loadTxt: '网络似乎出了点问题~'
            })
         }
      })
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
      var that = this
      wx.showLoading({
         title: '加载中...',
      })
      let page = this.data.page + 20;
      var old_data = that.data.postList
      db.collection('forum').orderBy('time', 'desc').where({
         _openid: id
      }).skip(page).get({
         success: res => {
            var new_data = res.data
            if (new_data.length == 0) {
               wx.hideLoading()
               wx.showToast({
                  title: '就这么多啦！',
                  icon: "none"
               })
               that.setData({
                  no_more: true
               })
            } else {
               pattern.img(new_data, page, imgW, imgH, imgM, that)
               var postList = old_data.concat(new_data)
               that.setData({
                  postList,
                  page
               })
               if (openId) {
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
               wx.hideLoading()
            }
         }
      })
   },


   //轮播图点击预览
   preview: function (e) {
      var postList = this.data.postList
      img.preview(e, postList)
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

   // 评论数据累计
   comment: function (e) {
      var postId = e.currentTarget.dataset.id;
      wx.navigateTo({
         url: '../comment/comment?id=' + postId,
      })
   },


   //转发
   onShareAppMessage: function (res) {
      var postList = this.data.postList
      var postId = res.target.dataset.id;
      var i = res.target.dataset.index;
      var img = postList[i].img[0];
      var txt = postList[i].text
      return {
         title: '#' + txt,
         imageUrl: img,
         path: '/pages/forum/comment/comment?id=' + postId,
      }
   },


   // 页面高度监控
   onPageScroll(e) {
      forum.scroll(e, this)
   },

   // 返回链接
   back: function () {
      wx.navigateBack({
         url: '../forum',
      })
   },
})