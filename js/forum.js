const db = wx.cloud.database();
const _ = db.command

//阅读数量累计
function read(e) {
  var id = e.currentTarget.dataset.id
  var userId = e.currentTarget.dataset.userid
  db.collection('forum').doc(id).update({
    data: {
      read: _.inc(1)
    }
  })
  db.collection('user').where({
    _openid: userId
  }).get({
    success(res) {
      db.collection('user').doc(res.data[0]._id).update({
        data: {
          read: _.inc(1)
        }
      })
    }
  })
}

function praise(e, postList, _this) {
  let id = e.currentTarget.dataset.id;
  let index = e.currentTarget.dataset.index;
  var userId = e.currentTarget.dataset.userid;
  let hasChange = postList[index].hasChange
  let like = postList[index].like
  let openId = wx.getStorageSync('openId')
  if (!openId) {
    log.not_logged()
  } else {
    if (hasChange == false) {
      postList[index].like = (like + 1)
      postList[index].hasChange = true
      db.collection('forum').doc(id).update({
        data: {
          like: _.inc(1)
        }
      })
      db.collection('user').where({
        _openid: userId
      }).get({
        success(res) {
          db.collection('user').doc(res.data[0]._id).update({
            data: {
              praise: _.inc(1)
            }
          })
        }
      })
      db.collection('forum_dz').add({
        data: {
          postId: id,
        }
      })
      wx.showToast({
        title: '点赞成功！'
      })
    }
    _this.setData({
      postList
    })
  }
}


// 页面高度监控
function scroll(e, _this) {
  let isfixed = 1
  if (e.scrollTop < 50) {
    isfixed = 0
  } else {
    isfixed = 1;
  }
  _this.setData({
    top: e.scrollTop,
    isfixed
  });
}


module.exports = {
  praise,
  read,
  scroll,
}