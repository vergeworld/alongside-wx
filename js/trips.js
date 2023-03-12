const db = wx.cloud.database();
const _ = db.command

//阅读数量累计
function read(e) {
  var id = e.currentTarget.dataset.id
  var userId = e.currentTarget.dataset.userid
  db.collection('trips').doc(id).update({
    data: {
      read: _.inc(1)
    }
  })
}


// 下拉加载
var ig = require('./imgLayout')
function reachBottom(skip, postList, openId, _this) {
  _this.setData({
    moreTxt: '正在加载更多...'
  })
  db.collection('trips').where({
    _openid: openId
  }).orderBy('time', 'desc').skip(skip).get({
    success(res) {
      var new_data = res.data
      if (new_data[0]) {
        new_data = ig.imgLayout(new_data)
        postList = postList.concat(new_data)
        _this.setData({
          postList,
          skip,
          moreTxt: false
        })
      } else {
        _this.setData({
          moreTxt: '亲！就那么多啦（^_^）'
        })
      }
    },
    fail() {
      _this.setData({
        moreTxt: '网络异常，加载失败！（* _ *）'
      })
    },
    complete() {
      setTimeout(() => {
        _this.setData({
          moreTxt: false
        })
      }, 2000);
    }
  })
}

module.exports = {
  read,
  reachBottom
}