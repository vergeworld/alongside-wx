const db = wx.cloud.database();
Page({
  // 页面的初始数据
  data: {
    img: '',
    name: '',
    gender: '',
    school: '',
    label: '',
  },
  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    var img = wx.getStorageSync('img');
    var name = wx.getStorageSync('name');
    var gender = wx.getStorageSync('gender')
    var school = wx.getStorageSync('school');
    var label = wx.getStorageSync('label')
    this.setData({
      img,
      name,
      gender,
      school,
      label
    })
  },

  onShow() {
    this.onLoad()
  },

  chooseImage() {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original'],
      sourceType: ['album', 'camera'],
      success(res) {
        wx.showLoading({
          title: '正在保存...',
        })
        var tempFiles = res.tempFiles;
        if ((tempFiles[0].size) < 500000) {
          that.uploadCanvasImg(tempFiles[0].path);
        } else {
          that.getImgInfo(tempFiles[0].path)
        }
      },
    })
  },

  getImgInfo(tempFilePaths) {
    var that = this
    wx.getImageInfo({
      src: tempFilePaths,
      success(res) {
        var ratio = res.width / res.height
        if (res.type == 'gif') {
          that.uploadCanvasImg(res.path);
        } else {
          wx.getSystemInfo({
            success(res) {
              var pixelRatio = res.pixelRatio
              var targetHeight, targetWidth
              //等比例压缩，如果宽度大于高度，则宽度优先，否则高度优先
              if (pixelRatio > 1) {
                //宽>高
                targetHeight = Math.round(140 * pixelRatio);
                targetWidth = Math.round(targetHeight * ratio);
              } else {
                //宽<高
                targetWidth = Math.round(140 * pixelRatio);
                targetHeight = Math.round(targetWidth / ratio);
              }
              var ctx = wx.createCanvasContext('firstCanvas');
              ctx.drawImage(tempFilePaths, 0, 0, targetWidth, targetHeight);
              //裁剪画布
              _this.setData({
                cw: targetWidth,
                ch: targetHeight
              });
              ctx.draw(false, function () {
                setTimeout(function () {
                  wx.canvasToTempFilePath({
                    canvasId: 'firstCanvas',
                    fileType: 'jpg',
                    quality: 0.7, //图片质量
                    success: res => {
                      that.uploadCanvasImg(res.tempFilePath);
                    },
                    fail() {
                      wx.showToast({
                        title: '修改失败'
                      })
                    }
                  }, this)
                }, 100)
              })
            }
          })
        }
      }
    })
  },

  uploadCanvasImg(res) {
    var that = this
    let timestamp = Math.round(new Date());
    const filePath = res;
    const cloudPath = 'user/' + timestamp + filePath.match(/\.[^.]+?$/)[0]
    wx.cloud.uploadFile({
      cloudPath,
      filePath,
      success: res => {
        var img = res.fileID
        wx.setStorageSync('img', img)
        that.setData({
          img
        })
        that.upload_img(img)
      },
      fail(err) {
        wx.showToast({
          title: '修改失败！',
          icon: 'none'
        })
      },
    })
  },

  upload_img(img) {
    wx.setStorageSync('img', img)
    var id = wx.getStorageSync('id')
    var nickName = wx.getStorageSync('name')
    db.collection('user').doc(id).update({
      data: {
        url: img
      },
    })
    wx.cloud.callFunction({
      name: 'forum',
      data: {
        name: nickName,
        url: img
      },
      success(res) {},
      fail(err) {
        wx.showToast({
          title: '修改失败',
        })
      },complete(){
        wx.hideLoading()
      }
    })
  },

  // 点击查看图片
  preview() {
    var img = []
    img[0] = this.data.img;
    wx.previewImage({
      urls: img,
    })
  },


  // 退出当前账户
  remove() {
    wx.showModal({
      cancelColor: 'red',
      confirmColor: 'black',
      content: '是否退出当前账户，下次登陆依然可以使用本账号。',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '退出中...',
          })
          wx.clearStorageSync()
          setTimeout(function () {
            wx.hideLoading({
              complete: (res) => {
                wx.navigateBack()
              },
            })
          }, 2000)

        } else if (res.cancel) {
          console.log('用户点击取消')
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

  school() {
    wx.navigateTo({
      url: '../person/school/school',
    })
  },

  label() {
    wx.navigateTo({
      url: '../person/label/label',
    })
  },

})