const db = wx.cloud.database();
const _ = db.command
var ig = require('../../js/imgLayout');
var sy = require('../../js/system')

Page({
  // 页面的初始数据
  data: {
    navShow: true,
    postList: [], //内容列表
    appImg: '/images/app.png',
    intentImg: '/images/intent.png',
    leftRight: '/images/left_right.png',
    isNoImg: '/images/isNo.png',
    not_net: false, // 判断网络状态
    skip: 0, // 
    fromRegion: {
      value: ['全部', '全部', '全部', '全部'], //在哪
      code: []
    },
    toRegion: {
      value: ['全部', '全部', '全部', '全部'],
      code: []
    },
    identify: -1, //0：乘客, 1：车主
    type: -1 // -1：全部，0：人找车，1：车找人,
  },
  onLoad() {
    var that = this
    let userState = wx.getStorageSync('userStatus')
    let localPost = wx.getStorageSync('postList')
    let source = wx.getStorageSync('source')
    if (userState) {
      let userInfo = wx.getStorageSync('userInfo')
      that.setData({
        identify: userInfo.identify,
        fromRegion: userInfo.address.value[0] ? userInfo.address : this.data.fromRegion
      })
    }
    that.setData({
      postList: localPost ? localPost : [],
      slideShows: source ? source.home.slideShow : []
    })

    // promise 风格
    db.collection("source").doc('3').get().then(res => {
      wx.setStorageSync('source', res.data)
      that.setData({
        slideShows: res.data.home.slideshow
      })
    })
    this.postList(this.data.identify, this.data.fromRegion, this.data.toRegion)
  },

  onShow() {
    // 登录、身份切换、地址修改
    let isShow = wx.getStorageSync('isReloadHome')
    let userStatus = wx.getStorageSync('userStatus')
    if (isShow && userStatus) {
      let userInfo = wx.getStorageSync('userInfo')
      let identify = userInfo ? userInfo.identify : -1
      let fromRegion = userInfo.address.value[0] ? userInfo.address : this.data.fromRegion
      this.postList(identify, fromRegion, this.data.toRegion)
      wx.removeStorageSync('isReloadHome')
      this.setData({
        identify,
        fromRegion
      })
    }
  },

  //  identify 2：全部，1：找人，0：找车
  // fromRegion 在哪里
  // toRegion 去哪里
  postList(identify, fromRegion, toRegion) {
    let that = this
    wx.showLoading({
      title: '加载中...',
    })
    // 校准获取类型
    let type = identify === -1 ? _.eq(0).or(_.eq(1)) : identify
    let fc = fromRegion.code // 地区编号
    let tc = toRegion.code
    db.collection('trips')
      .where({
        type,
        is_delete: 1, // 1: 表示没删除
        'fromCode.0': fc[0],
        'fromCode.1': fc[1],
        'fromCode.2': fc[2],
        'fromCode.3': fc[3],
        'toCode.0': tc[0],
        'toCode.1': tc[1],
        'toCode.2': tc[2],
        'toCode.3': tc[3]
      }).orderBy('sequence', 'desc')
      .get({
        success(res) {
          // 判断返回数据数量
          let isNo = false
          if (!res.data[0]) {
            isNo = true
          }
          // 校准获取类型
          let postList = ig.imgLayout(res.data)
          // 存储新数据到本地
          wx.setStorageSync('postList', postList.slice(0, 20))
          that.setData({
            postList,
            not_net: false,
            fromRegion,
            toRegion,
            skip: 0,
            isNo
          })
        },
        fail(err) {
          console.log(err, 'err');
          that.setData({
            not_net: true,
            postList: [],
            slideShows: []
          })
        },
        complete() {
          wx.hideLoading()
        }
      })
  },

  onPullDownRefresh: function () {
    let dt = this.data
    let identify = dt.identify
    let fromRegion = dt.fromRegion
    let toRegion = dt.toRegion
    this.postList(identify, fromRegion, toRegion)
    wx.stopPullDownRefresh()
  },


  onPageScroll(e) {
    if (e.scrollTop > 5) {
      this.setData({
        nav: true
      })
    } else {
      this.setData({
        nav: false
      })
    }
  },


  // 页面下拉加载刷新
  onReachBottom: function (res) {
    var that = this
    let dt = that.data
    var skip = dt.skip + 20;
    let type = dt.identify === -1 ? _.eq(0).or(_.eq(1)) : dt.identify
    var postList = dt.postList;
    that.setData({
      moreTxt: '正在加载更多...'
    })
    let fc = dt.fromRegion.code
    let tc = dt.toRegion.code
    db.collection('trips')
      .where({
        type,
        is_delete: 1, // 1: 表示没删除
        'fromCode.0': fc[0],
        'fromCode.1': fc[1],
        'fromCode.2': fc[2],
        'fromCode.3': fc[3],
        'toCode.0': tc[0],
        'toCode.1': tc[1],
        'toCode.2': tc[2],
        'toCode.3': tc[3],
      }).orderBy('sequence', 'desc')
      .skip(skip).get({
        success: res => {
          if (res.data.length == 0) {
            that.setData({
              moreTxt: '亲！就那么多啦（^_^）'
            })
            return
          }
          var new_data = ig.imgLayout(res.data)
          postList = postList.concat(new_data)
          that.setData({
            postList,
            moreTxt: false,
            skip
          })
        },
        fail() {
          that.setData({
            moreTxt: '网络异常，加载失败！（* _ *）',
          })
        },
        complete() {
          setTimeout(() => {
            that.setData({
              moreTxt: false
            })
          }, 3000);
        }
      })
  },


  // 重新连接网络
  renovate() {
    let dt = this.data
    let identify = dt.identify
    let fromRegion = dt.fromRegion
    let toRegion = dt.toRegion
    this.postList(identify, fromRegion, toRegion)
  },

  // 轮播详情页
  toSlideShow(e) {
    let ds = e.currentTarget.dataset
    let url = ds.url
    let id = ds.id
    wx.navigateTo({
      url: url + '?id=' + id,
    })
  },

  // 个人页面跳转
  toPersion: function (e) {
    var openId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../home/personal/personal?id=' + openId,
    })
  },

  // 跳转到个人身份选择
  toIdentify() {
    let userStatus = wx.getStorageSync('userStatus')
    if (userStatus) {
      wx.navigateTo({
        url: './../my/person/identity/identity',
      })
      return
    }
    wx.showModal({
      title: '账号未登录，请先登录！',
      content: '',
      complete: (res) => {
        if (res.confirm) {
          wx.navigateTo({
            url: '../login/login',
          })
        }
      }
    })

  },


  //评论页面
  toDetail: function (e) {
    var postId = e.currentTarget.dataset.id;
    var userId = e.currentTarget.dataset.userid;
    db.collection('trips').doc(postId).update({
      data: {
        read: _.inc(1)
      }
    }).then(res => {
      wx.navigateTo({
        url: '../home/detail/detail?id=' + postId + "&num=" + userId,
      })
    })
  },

  // 阻止事件冒泡
  catchShare(e) {},

  //转发
  onShareAppMessage: function (res) {
    var postList = this.data.postList;
    var postId = res.target.dataset.id;
    var i = res.target.dataset.index;
    var imageUrl = postList[i].imgs[0];
    var from = postList[i].fromValue[3] || postList[i].fromValue[2]
    var to = postList[i].toValue[3] || postList[i].toValue[2]
    var title = `${postList[i].type ? '人找车':'车找人'} ${from}前往${to} `
    if (!imageUrl) {
      imageUrl = postList[i].avatarUrl
    }
    return {
      title: title,
      imageUrl: imageUrl,
      path: '/pages/home/detail/detail?id=' + postId,
    }
  },


  // 省市区选择器
  bindNavShow() {
    this.setData({
      navShow: false
    })
  },

  // 在哪里
  fromBindRegionChange(e) {
    let identify = this.data.identify
    let fromRegion = {}
    fromRegion.value = e.detail.value //地区名称
    fromRegion.code = e.detail.code //地区编号
    let toRegion = this.data.toRegion
    this.postList(identify, fromRegion, toRegion)
  },
  // 去哪里
  toBindRegionChange(e) {
    let identify = this.data.identify
    let fromRegion = this.data.fromRegion
    let toRegion = {}
    toRegion.value = e.detail.value
    toRegion.code = e.detail.code
    this.postList(identify, fromRegion, toRegion)
    this.setData({
      navShow: true
    })
  }
})