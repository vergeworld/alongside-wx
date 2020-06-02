  // 提交评论
  const db = wx.cloud.database();
  const _ = db.command
  var util = require("../utils/util.js");

  function form(e, id, ons, db, set, _this) {
    var that = this
    let txt = e.detail.value.comment
    var comment = {
      time: util.formatTime(new Date()),
      url: wx.getStorageSync('img'),
      name: wx.getStorageSync('name'),
      imgs: ons,
      txt: txt
    }
    var openId = wx.getStorageSync('openId')
    if (!openId) {
      wx.showToast({
        title: '您还未登录,请先登录~',
        icon: 'none'
      })
      setTimeout(() => {
        wx.switchTab({
          url: '../pages/login/login',
        })
      }, 1500)
    } else {
      if (!txt && !ons[0]) {
        wx.showToast({
          title: '你还没有输入内容！',
          icon: 'none'
        })
      } else {
        const _ = db.command
        db.collection(set).doc(id).update({
          data: {
            comment: _.inc(1),
            commentList: _.push(comment)
          },
          success: res => {
            that.commentList(set, id, _this)
            wx.showToast({
              title: '提交成功',
            })
          }
        })
        _this.setData({
          sendMoreMsgFlag: false,
          value: '',
          ons: []
        });
      }
    }
  }

  function commentList(set, id, _this) {
    db.collection(set).doc(id).get({
      success(res) {
        let commentList = res.data.commentList.reverse()
        _this.setData({
          commentList,
        })
      }
    })
  }

    //推荐数量累计
    function recommend(postList, set, set_tj, id,_this) {
      let hasChange = postList[0].hasChange
      let recommend = postList[0].recommend
      let openId = wx.getStorageSync('openId')
      if (!openId) {
        wx.showToast({
          title: '您还未登录,请先登录~',
          icon: 'none'
        })
        setTimeout(() => {
          wx.switchTab({
            url: '../../login/login',
          })
        }, 2000)
      } else {
        if (hasChange == false) {
          postList[0].recommend = (recommend + 1)
          postList[0].hasChange = true
          const _ = db.command
          db.collection(set).doc(id).update({
            data: {
              recommend: _.inc(1)
            }
          })
          db.collection(set_tj).add({
            data: {
              postId: id
            },
            success() {
              wx.showToast({
                title: '推荐成功',
              })
            }
          })
        }
        _this.setData({
          postList
        })
      }
    }

  module.exports = {
    form,
    commentList,
    recommend,
  }