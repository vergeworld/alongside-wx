const db = wx.cloud.database();
const _ = db.command
Page({
  // 页面的初始数据
  data: {
    arrowRight: '/images/arrow-right.png',
    region: ['全部', '全部', '全部', '全部'],
  },
  // 生命周期函数--监听页面加载
  onLoad: function (options) {

  },

  onShow() {
    var userInfo = wx.getStorageSync('userInfo')
    this.setData({
      userInfo,
      avatarUrl: userInfo.avatarUrl,
      region: userInfo.address.value
    })
    let noPhone = wx.getStorageSync('noPhone');
    if (noPhone) {
      wx.removeStorageSync('noPhone')
    }
  },


  chooseImage() {
    let that = this
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      maxDuration: 30,
      camera: 'back',
      success(res) {
        wx.showLoading({
          title: '正在修改...',
        })
        var tempPath = res.tempFiles[0].tempFilePath;
        that.uploadCanvasImg(tempPath)
      },
    })
  },

  uploadCanvasImg(tempPath) {
    var that = this
    let timestamp = Math.round(new Date());
    const filePath = tempPath;
    const cloudPath = 'user/' + timestamp + filePath.match(/\.[^.]+?$/)[0]
    wx.cloud.uploadFile({
      cloudPath,
      filePath,
      success: res => {
        var avatarUrl = res.fileID
        that.setData({
          avatarUrl
        })
        that.upload_img(avatarUrl)
      },
      fail(err) {
        wx.showToast({
          title: '上传图片失败！',
          icon: 'none'
        })
      },
    })
  },

  upload_img(avatarUrl) {
    let userInfo = this.data.userInfo
    let id = userInfo._id
    let nickName = userInfo.nickName
    db.collection('user').doc(id).update({
      data: {
        avatarUrl
      },
      success() {
        db.collection('trips').where({
          _openid: userInfo._openid
        }).update({
          data: {
            nickName,
            avatarUrl
          },
          success(res) {
            userInfo.avatarUrl = avatarUrl
            wx.setStorageSync('userInfo', userInfo)
          },
          fail(err) {
            wx.showToast({
              title: '头像修改失败',
            })
          },
          complete() {
            wx.hideLoading()
          }
        })
      }
    })

  },

  // 点击查看图片
  preview() {
    var img = []
    img[0] = this.data.avatarUrl;
    wx.previewImage({
      urls: img,
    })
  },


  // 退出当前账户
  remove() {
    wx.showModal({
      content: '是否退出当前账户，下次登陆依然可以使用本账号。',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在退出...',
          })
          wx.removeStorageSync('userInfo')
          wx.setStorageSync('userStatus', 0);
          wx.setStorageSync('isReloadHome', true);
          wx.reLaunch({
            url: '../../home/home',
          })
        }
      }
    })
  },

  name() {
    wx.navigateTo({
      url: '../person/name/name',
    })
  },

  gender() {
    wx.navigateTo({
      url: '../person/gender/gender',
    })
  },

  toPhone() {
    wx.navigateTo({
      url: '../person/phone/phone?id=' + 0,
    })
  },

  toIdentity() {
    wx.navigateTo({
      url: '../person/identity/identity',
    })
  },

  // 省市区选择器
  BindRegionChange: function (e) {
    let that = this //保存this 对象
    let userInfo = that.data.userInfo
    let id = userInfo._id
    let address = {}
    address.value = e.detail.value //地区名称
    address.code = e.detail.code //地区编号
    console.log(address);
    db.collection('user').doc(id).update({
      data: {
        address: _.set(address)
      },
      success(res) {
        that.setData({
          region: address.value
        })
        userInfo.address = address
        wx.setStorageSync('userInfo', userInfo)
        wx.setStorageSync('isReloadHome', true)
      },
      fail(err) {
        wx.showToast({
          title: '网络异常，请稍后重试',
          icon: 'none'
        })
      }
    })

  },


  label() {
    wx.navigateTo({
      url: '../person/label/label',
    })
  },

})