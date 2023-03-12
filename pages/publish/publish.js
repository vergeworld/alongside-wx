const db = wx.cloud.database();
const up = require('../../js/compressed');
Page({
  data: {
    headline: ["愿与同行\n  随处可搭", '结伴同行\n  我来拼搭'],
    navData: ['我是车主', '我是乘客'],
    currentTab: 0,
    navScrollLeft: 0,
    fromRegion: {
      value: ['全部', '全部', '全部', '全部'], //在哪
      code: []
    },
    toRegion: {
      value: ['全部', '全部', '全部', '全部'],
      code: []
    },
    customItem: '全部',
    content: '',
    upImgs: [],
  },

  onLoad() {
    let source = wx.getStorageSync('source')
    if (source) {
      this.setData({
        publishImg: wx.getStorageSync('source').publish.banner
      })
    }
  },

  onShow() {
    let getDate = wx.getStorageSync('setDate')
    if (getDate) {
      this.setData({
        date: getDate
      })
      wx.removeStorageSync('setDate')
    }
    let payDone = wx.getStorageSync('payDone')
    if (payDone) {
      this.setData({
        fromRegion: {
          value: ['全部', '全部', '全部', '全部'], //在哪
          code: []
        },
        toRegion: {
          value: ['全部', '全部', '全部', '全部'],
          code: []
        },
        date: '',
        content: '',
        imgs: [],
        upImgs: [],
      })
      wx.removeStorageSync('payDone')
    }
    wx.hideLoading()
  },



  // 自定义方法
  switchNav(event) {
    var cur = event.currentTarget.dataset.current;
    if (this.data.currentTab == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      })
    }
  },

  switchTab(event) {
    var cur = event.detail.current;
    this.setData({
      currentTab: cur
    });
  },

  // textarea 绑定
  bindTextArea(e) {
    this.setData({
      content: e.detail.value
    })
  },

  // 图片预览
  preview(e) {
    let imgs = this.data.upImgs
    let current = e.currentTarget.dataset.idx
    console.log(current);
    wx.previewImage({
      urls: imgs,
      current: imgs[current]
    })
  },

  submit(e) {
    var that = this
    // 发布类型序号
    let subType = e.currentTarget.dataset.idx;
    wx.showLoading({
      title: '正在上传',
      mask: true
    })
    // 登录检测
    if (!that.isLogin()) {
      return
    }
    // 设计数据存储
    let dt = that.data
    var timestamp = Date.parse(new Date()) / 1000; //获取时间戳
    let userInfo = wx.getStorageSync('userInfo')
    let type = dt.currentTab; //0: 表示车主，1：表示乘客
    let privilege = 0; //特权
    let sequence = timestamp; // 特权时长
    let is_delete = 0; // 标记删除 0：删除，1，未删除
    let nickName = userInfo.nickName; //用户昵称
    let avatarUrl = userInfo.avatarUrl; //用户头像
    let phone = userInfo.phone; // 用户号码
    let fromRegion = dt.fromRegion; //出发地
    let toRegion = dt.toRegion; //目的地
    let time = timestamp
    let date = dt.date; // 出发日期
    let content = dt.content; //发布内容
    let imgs = dt.upImgs;
    let read = 1; //阅读人数
    let commentList = []; //评论
    // 必要填写内容判断
    // 电话
    if (phone == '') {
      wx.hideLoading()
      wx.showModal({
        content: '缺少联系电话，请前往填写',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/my/person/phone/phone?pageId=publish',
            })
          } else if (res.cancel) {

          }
        }
      })
      return
    }
    // 出发地
    if (fromRegion.value[1] === '全部') {
      wx.showToast({
        title: '请选择你在哪里',
        icon: 'none'
      })
      return
    }
    // 目的地
    if (toRegion.value[1] === '全部') {
      wx.showToast({
        title: '请选择你去哪里',
        icon: 'none'
      })
      return
    }
    // 日期
    if (!dt.date) {
      wx.showToast({
        title: '请选择出发日期',
        icon: 'none'
      })
      return
    }

    // 组装数据
    let data = {
      is_delete,
      sequence,
      type,
      privilege,
      nickName,
      avatarUrl,
      phone,
      fromValue: fromRegion.value,
      fromCode: fromRegion.code,
      toValue: toRegion.value,
      toCode: toRegion.code,
      date,
      content,
      imgs,
      read,
      commentList,
      time
    }
    // 发布类型判断 0：免费发布，1：付费发布
    if (subType) {
      let listData = JSON.stringify(data) //对数组、对象进行转换
      wx.navigateTo({
        url: '../publish/pay/pay?data=' + listData,
      })
      return
    }

    db.collection('trips').add({
      data,
      success: src => {
        db.collection('trips').where({
            _id: src._id
          }).update({
            data: {
              is_delete: 1
            }
          }),
          wx.showToast({
            title: '提交成功',
          })
        wx.setStorageSync('isReloadHome', true)
        that.setData({
          fromRegion: {
            value: ['全部', '全部', '全部', '全部'], //在哪
            code: []
          },
          toRegion: {
            value: ['全部', '全部', '全部', '全部'],
            code: []
          },
          date: '',
          content: '',
          imgs: [],
          upImgs: []
        })
      },
      fail: err => {
        console.log('err', err);
        that.setData({})
        wx.showToast({
          title: '网络异常,请稍后重试~',
          icon: 'none'
        })
      }
    })
  },


  // 登录检测
  isLogin() {
    let status = 1;
    let userSatus = wx.getStorageSync('userStatus')
    if (!userSatus) {
      status = 0;
      wx.hideLoading()
      wx.showModal({
        content: '账号未登录，请先登录！',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login?pageId=publish',
            })
          }
        }
      }) 
    }
    return status
  },

  // 省市区选择器
  // 在哪里
  fromBindRegionChange(e) {
    let fromRegion = {}
    fromRegion.value = e.detail.value //地区名称
    fromRegion.code = e.detail.code //地区编号
    this.setData({
      fromRegion
    })
  },
  // 去哪里
  toBindRegionChange(e) {
    let toRegion = {}
    toRegion.value = e.detail.value
    toRegion.code = e.detail.code
    this.setData({
      toRegion
    })
  },

  // 跳转到地区选择页面
  toRegion() {
    wx.navigateTo({
      url: '/pages/publish/region/region',
    })
  },

  // 跳转到日期选择页面
  toDate() {
    wx.navigateTo({
      url: '/pages/publish/date/date',
    })
  },

  // 选择图片
  chooseImage(event) {
    var num = 2;
    var upImgs = this.data.upImgs;
    var route = 'publish/trips/';
    if (upImgs.length < num) {
      up.chooseImage(upImgs, num, route, this)
    } else {
      wx.showToast({
        title: '最多可以选择' + num + '图片',
        icon: 'none'
      })
    }
  },

  //删除图片
  deleteImage: function (event) {
    var index = event.currentTarget.dataset.idx;
    this.data.upImgs.splice(index, 1);
    this.setData({
      upImgs: this.data.upImgs
    });
  },



})