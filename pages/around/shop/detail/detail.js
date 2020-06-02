const db = wx.cloud.database();
const _ = db.command
var log = require('../../../../js/not_logged.js')
var postId
let list
Page({
  data: {
    postList: [],
    loadImg: '',
    loadTxt: '',
    hideFlag: true, //true-隐藏  false-显示
    animationData: {},
    number: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    let that = this
    postId = e.id
    db.collection('shop').doc(postId).get({
      success(res) {
        var postList = that.data.postList
        postList[0] = res.data
        var commentList = postList[0].commentList.reverse()
        that.setData({
          postList,
          commentList,
        })
      },
      fail(err) {
        that.setData({
          loadImg: '/images/post/3.4.png',
          loadTxt: '网络似乎出了点问题~'
        })
      }
    })
  },

  //页面事件监控
  onShow() {
    var that = this
    db.collection('shop').doc(postId).get({
      success(res) {
        let commentList = res.data.commentList.reverse()
        that.setData({
          commentList,
          number: 1
        })
      },
      fail(err) {
        console.log('获取失败')
      }
    })
  },

  //轮播图点击预览
  preview: function (e) {
    var i = e.currentTarget.id
    var that = this;
    var postList = that.data.commentList
    var src = e.currentTarget.dataset.src; //获取data-src
    var imgList = postList[i].imgs; //获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  },

  // ----------------------------------------------------------------------modal
  // 显示遮罩层
  showModal: function () {
    var openId = wx.getStorageSync('openId')
    if (!openId) {
      log.not_logged()
    } else {
      var that = this;
      that.setData({
        hideFlag: false
      })
      // 创建动画实例
      var animation = wx.createAnimation({
        duration: 400, //动画的持续时间
        timingFunction: 'ease', //动画的效果 默认值是linear->匀速，ease->动画以低速开始，然后加快，在结束前变慢
      })
      this.animation = animation; //将animation变量赋值给当前动画
      var time1 = setTimeout(function () {
        that.slideIn(); //调用动画--滑入
        clearTimeout(time1);
        time1 = null;
      }, 100)
    }
  },

  // 隐藏遮罩层
  mCancel: function () {
    var that = this;
    var animation = wx.createAnimation({
      duration: 400, //动画的持续时间 默认400ms
      timingFunction: 'ease', //动画的效果 默认值是linear
    })
    this.animation = animation
    that.slideDown(); //调用动画--滑出
    var time1 = setTimeout(function () {
      that.setData({
        hideFlag: true
      })
      clearTimeout(time1);
      time1 = null;
    }, 220) //先执行下滑动画，再隐藏模块
  },
  //动画 -- 滑入
  slideIn: function () {
    this.animation.translateY(0).step() // 在y轴偏移，然后用step()完成一个动画
    this.setData({
      //动画实例的export方法导出动画数据传递给组件的animation属性
      animationData: this.animation.export()
    })
  },
  //动画 -- 滑出
  slideDown: function () {
    this.animation.translateY(300).step()
    this.setData({
      animationData: this.animation.export(),
    })
  },

  //数量累计
  add: function (e) {
    let number = this.data.number
    number = (number + 1)
    this.setData({
      number
    })
  },

  cut: function (e) {
    let number = this.data.number
    if (number > 1) {
      number = (number - 1)
    }
    this.setData({
      number
    })
  },


  // 加入购物车
  submit(e) {
    var that = this
    wx.showLoading({
      title: '正在处理...',
    })
    const _ = db.command
    var number = that.data.number
    wx.cloud.callFunction({
      name: 'shop',
      data: {
        postId: postId
      },
      success: res => {
        list = res.result.data
        if (!list[0]) {
          that.add_car(number)
          db.collection('shop').doc(postId).update({
            data: {
              buy: _.inc(number)
            },
          })
        } else {
          db.collection('shop_car').doc(list[0]._id).update({
            data: {
              number: _.inc(number)
            },
          })
          db.collection('shop').doc(postId).update({
            data: {
              buy: _.inc(number)
            },
          })
        }
        that.mCancel()
        wx.hideLoading()
      },
      fail(err) {
        wx.hideLoading()
        wx.showToast({
          title: '添加失败',
          icon: 'none'
        })
      }
    })
  },

  add_car(number) {
    var post = this.data.postList[0]
    db.collection('shop_car').add({
      data: {
        img: post.img[0],
        name: post.name,
        price: post.price,
        taste: post.taste,
        postId: post._id,
        number: number
      },
      success: res => {
        this.mCancel()
      }
    })
  },

  back() {
    wx.navigateBack({
      delta: 1,
    })
  },

  car() {
    wx.navigateTo({
      url: '../car/car',
    })
  },

  service() {
    wx.navigateTo({
      url: '../../../my/service/service',
    })
  },

  comment(e) {
    var postId = e.currentTarget.dataset.id
    var openId = wx.getStorageSync('openId');
    if (!openId) {
      log.not_logged()
    } else {
      wx.navigateTo({
        url: '../comment/comment?id=' + postId,
      })
    }
  },

  onPageScroll(e) {
    let isfixed = 1
    if (e.scrollTop < 60) {
      isfixed = 0
    } else {
      isfixed = 1;
    }
    this.setData({
      isfixed
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})