  // 提交评论
  const db = wx.cloud.database();
  const _ = db.command;
  var util = require("../utils/util.js");

  function form(e, id, set, len, commentList, _this) {
    let txt = e.detail.value.comment
    if (txt) {
      wx.cloud.callFunction({
        name: 'msgcheck',
        data: {
          content: txt // 内容检测
        }
      }).then(res => {
        if (res.result.errCode == 87014) {
          wx.showToast({
            title: '请注意言行！',
            icon: 'none'
          })
        } else {
          var user = wx.getStorageSync('userInfo');
          var comment = {
            txt: txt,
            url: user.avatarUrl,
            name: user.nickName,
            time: new Date().getTime() / 1000,
          }
          db.collection(set).doc(id).update({
            data: {
              commentList: _.unshift(comment)
            },
            success: res => {
              len++
              comment.time = util.getDiffTime(comment.time, true);
              commentList.unshift(comment)
              _this.setData({
                len,
                value: null,
                commentList,
              })
            },
            fail() {
              wx.showToast({
                title: '网络异常，请稍后重试!',
                icon: 'none'
              })
            },
            complete() {
              wx.hideLoading()
            }
          })
        }
      })
    } else {
      _this.setData({
        disabled:false
      })
      wx.showToast({
        icon: 'none',
        title: '请输入内容',
      })
    }
  }



  module.exports = {
    form
  }