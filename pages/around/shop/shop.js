const db = wx.cloud.database();
// 右侧每一类的 bar 的高度（固定）
const RIGHT_BAR_HEIGHT = 100;
// 右侧每个子类的高度（固定）
const RIGHT_ITEM_HEIGHT = 200;
// 左侧每个类的高度（固定）
const LEFT_ITEM_HEIGHT = 50
Page({
  data: {
    loadImg: '/images/post/3.3.gif',
    loadTxt: '拼命加载中...',
    constants: [],
    constants: [{
        "id": "id1",
        "name": "休闲零食",
        "depict": "健康美味，欢乐必备",
        "img": "/images/post/11.png",
        "category": []
      },
      {
        "id": "id2",
        "name": "汽水饮料",
        "depict": "老味道，新感觉。",
        "img": "/images/post/10.png",
        "category": []
      },
      {
        "id": "id3",
        "name": "其他分类",
        "depict": "老味道，新感觉。",
        "img": "/images/post/12.png",
        "category": []
      },
    ],
    //模拟 数据
    // 左 => 右联动 右scroll-into-view 所需的id
    HZL_toView: null,
    // 当前左侧选择的
    HZL_currentLeftSelect: 'id1',
    // 右侧每类数据到顶部的距离（用来与 右 => 左 联动时监听右侧滚动到顶部的距离比较）
    HZL_eachRightItemToTop: [],
    HZL_leftToTop: 0
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    let that = this
    var constants = that.data.constants
    // 分别获取零食列表内容
    db.collection("shop").where({
      label: '休闲零食'
    }).get({
      success: res => {
        constants[0].category = res.data
        db.collection("shop").where({
          label: '汽水饮料'
        }).get({
          success: res => {
            constants[1].category = res.data
            db.collection("shop").where({
              label: '其他分类'
            }).get({
              success: res => {
                constants[2].category = res.data
                that.setData({
                  constants,
                  show: true
                })
                that.system()
                that.showModal()
              },
            })
          }
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

  showModal() {
    wx.showModal({
      cancelColor: 'cancelColor',
      title: '店长信箱',
      content: '你想吃什么，告诉店长吧！',
      success(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../../my/opinion/opinion',
          })
        } else if (res.cancel) {
          wx.showToast({
            title: '正在筹备中，敬请期待!',
            icon: 'none',
            duration: 3000
          })
        }
      }
    })
  },

  system() {
    //高度大小
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        var HZL_height = res.windowHeight - 50
        that.setData({
          HZL_height: HZL_height,
          HZL_eachRightItemToTop: that.HZL_getEachRightItemToTop()
        })
      }
    });
  },


  // 获取每个右侧的 bar 到顶部的距离，用来做后面的计算。
  HZL_getEachRightItemToTop: function () {
    var obj = {};
    var totop = 0;
    let constants = this.data.constants;
    // 右侧第一类肯定是到顶部的距离为 0
    obj[constants[0].id] = totop
    // 循环来计算每个子类到顶部的高度
    for (let i = 1; i < (constants.length + 1); i++) {
      totop += (RIGHT_BAR_HEIGHT + constants[i - 1].category.length * RIGHT_ITEM_HEIGHT / 2)
      // 这个的目的是 例如有两类，最后需要 0-1 1-2 2-3 的数据，所以需要一个不存在的 'last' 项，此项即为第一类加上第二类的高度。
      obj[constants[i] ? constants[i].id : 'last'] = totop
    }
    return obj
  },
  // 监听右侧的滚动事件与 HZL_eachRightItemToTop 的循环作对比 从而判断当前可视区域为第几类，从而渲染左侧的对应类。
  right: function (e) {
    for (let i = 0; i < this.data.constants.length; i++) {
      let left = this.data.HZL_eachRightItemToTop[this.data.constants[i].id]
      let right = this.data.HZL_eachRightItemToTop[this.data.constants[i + 1] ? this.data.constants[i + 1].id : 'last']
      if (e.detail.scrollTop < right && e.detail.scrollTop >= left) {
        this.setData({
          HZL_currentLeftSelect: this.data.constants[i].id,
          HZL_leftToTop: LEFT_ITEM_HEIGHT * i
        })
      }
    }
  },
  // 左侧类的点击事件，点击时，右侧会滚动到对应分类
  left: function (e) {
    this.setData({
      HZL_toView: e.target.id || e.target.dataset.id,
      HZL_currentLeftSelect: e.target.id || e.target.dataset.id
    })
  },

  // 加入购物车
  add(e) {
    var that = this
    const _ = db.command
    var postId = e.currentTarget.dataset.id
    var openId = wx.getStorageSync('openId')
    if (!openId) {
      wx.showToast({
        title: '亲！您还没有登陆~~',
        icon: 'none'
      })
    } else {
      wx.cloud.callFunction({
        name: 'shop',
        data: {
          postId: postId
        },
        success: res => {
          var list = res.result.data
          if (!list[0]) {
            that.add_car()
            db.collection('shop').doc(postId).update({
              data: {
                buy: _.inc(number)
              },
            })
          } else {
            db.collection('shop_car').doc(postId).update({
              data: {
                number: _.inc(1)
              },
              success: res => {
                db.collection('shop').doc(list[0]._id).update({
                  data: {
                    buy: _.inc(1)
                  },
                })
                wx.showToast({
                  title: '添加成功',
                })
              }
            })
          }
        },
        fail(err) {
          wx.showToast({
            title: '添加失败',
            icon: 'none'
          })
        }
      })
    }
  },

  // 增加新订单
  add_car() {
    var post = this.data.postList[0]
    db.collection('shop_car').add({
      data: {
        img: post.img[0],
        name: post.name,
        price: post.price,
        taste: post.taste,
        postId: post._id,
        number: 1
      },
      success: res => {
        wx.showToast({
          title: '添加成功',
        })
      }
    })
  },

  // 搜索页面
  search() {
    wx.navigateTo({
      url: '../shop/search/search',
    })
  },

  // 详情页面
  detail(e) {
    var postId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../shop/detail/detail?id=' + postId,
    })
  },

  // 购物车页面
  car() {
    wx.navigateTo({
      url: '../../around/shop/car/car',
    })
  },

  // 用户点击右上角分享
  onShareAppMessage: function () {

  }
})