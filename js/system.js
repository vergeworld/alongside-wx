const db = wx.cloud.database();
const _ = db.command
var util = require("../utils/util.js");
var ig = require("./imgLayout.js")

// 获取当前屏幕高度
function system(height, _this) {
  wx.getSystemInfo({
    success: function (res) {
      var screen_height = res.windowHeight - height
      _this.setData({
        screen_height
      })
    }
  });
}

// 账号登陆提示
function not_logged() {
  wx.showToast({
    title: '您还未登录,将跳转到登陆界面~',
    icon: 'none',
  })
  setTimeout(() => {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  }, 2000)
};

// 时间转换
function time(postList) {
  for (let i = 0; i < postList.length; i++) {
    var time = util.getDiffTime(postList[i].time, true);
    postList[i].time = time
  }
}

// 页面高度监控
function scroll(e, _this) {
  let isfixed = 1
  if (e.scrollTop < 20) {
    isfixed = 0
  } else {
    isfixed = 1;
  }
  _this.setData({
    top: e.scrollTop,
    isfixed
  });
}

// 触底加载_0
function reachBottom(set,order, skip, postList, _this) {
  _this.setData({
    moreTxt: '正在加载更多...'
  })
  db.collection(set).orderBy(order, 'desc').skip(skip).get({
    success: res => {
      var new_data = ig.img(res.data)
      console.log(new_data)
      postList = postList.concat(new_data)
      _this.setData({
        postList,
        moreTxt: false,
        skip,
      })
      if (!new_data[0]) {
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
      }, 3000);
    }
  })
}

// 触底加载_1
function reachBottom_Id(set, page, postList, openId, _this) {
  _this.setData({
    moreTxt: '正在加载更多...'
  })
  db.collection(set).where({
    _openid: openId
  }).orderBy('time', 'desc').skip(page).get({
    success(res) {
      let new_data = res.data
      if (new_data[0]) {
        postList = postList.concat(new_data)
        _this.setData({
          postList,
          page,
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

// 触底加载_2
function reachBottom_md(set, type, order, skip, postList, _this) {
  _this.setData({
    moreTxt: '正在加载更多...'
  })
  db.collection(set).where({
    type: type
  }).orderBy(order, 'desc').skip(skip).get({
    success(res) {
      let new_data = res.data
      if (new_data[0]) {
        postList = postList.concat(new_data)
        _this.setData({
          postList,
          page,
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

// 移除选项
function remove(e, postList, set, _this) {
  var postId = e.currentTarget.dataset.id
  var index = e.currentTarget.dataset.index
  wx.showActionSheet({
    itemList: ['删除'],
    success(res) {
      if (res.tapIndex == 0) {
        wx.showModal({
          title: '提示',
          content: '亲！是否删除此记录？',
          success: function (res) {
            if (res.confirm) {
              postList.splice(index, 1);
              db.collection(set).doc(postId).remove({
                success: function (res) {
                  wx.showToast({
                    title: '删除成功',
                  })
                  _this.setData({
                    postList
                  });
                  if (!postList[0]) {
                    _this.setData({
                      not_order: true,
                      not_post: true,
                      not_img: '/images/post/blank.png',
                      not_txt: '亲！你还没有分享内容哦'
                    })
                  }
                },
                fail(res) {
                  wx.showToast({
                    title: "网络异常，请稍后重试！",
                    icon: 'none'
                  })
                }
              })
            }
          }
        })
      }
    }
  })
}

// 移除选项
function remove_comt(e, commentList, set, _this) {
  var postId = e.currentTarget.dataset.id
  var index = e.currentTarget.dataset.index
  wx.showActionSheet({
    itemList: ['删除'],
    success(res) {
      if (res.tapIndex == 0) {
        wx.showModal({
          title: '提示',
          content: '亲！是否删除此记录？',
          success: function (res) {
            if (res.confirm) {
              commentList.splice(index, 1);
              db.collection(set).doc(postId).update({
                data: {
                  commentList: commentList
                },
                success: function (res) {
                  wx.showToast({
                    title: '删除成功',
                  })
                  _this.setData({
                    commentList
                  });
                },
                fail(res) {
                  wx.showToast({
                    title: "网络异常，请稍后重试！",
                    icon: 'none'
                  })
                }
              })
            }
          }
        })
      }
    }
  })
}


//转发分享
function share(e, postList, path) {
  var i = e.target.dataset.index;
  var img = postList[i].img[0];
  var txt = postList[i].text
  return {
    title: txt,
    imageUrl: img,
    path: path,
  }
}


//推荐数量累计
function recommend(set, id, _this) {
  console.log(id)
  let openId = wx.getStorageSync('openId')
  db.collection(set).doc(id).update({
    data: {
      recommend: _.inc(1),
      recommendList: _.unshift(openId)
    }
  })
  _this.setData({
    hasChange: true
  })
}

function preview(e, postList) {
  var i = e.currentTarget.id
  var src = e.currentTarget.dataset.src;
  var imgList = postList[i].img;
  wx.previewImage({
    current: src,
    urls: imgList
  })
}

function comt_preview(e, commentList) {
  var i = e.currentTarget.id
  var current = e.currentTarget.dataset.src;
  var urls = commentList[i].imgs;
  wx.previewImage({
    current: current,
    urls: urls
  })
}

module.exports = {
  system,
  not_logged,
  scroll,
  time,
  reachBottom,
  reachBottom_Id,
  reachBottom_md,
  remove,
  remove_comt,
  share,
  recommend,
  preview,
  comt_preview
}