function chooseImage(event, ons, num, route, _this) {
  // console.log('接收的参数长度为:' + arguments.length);
  var i = 0;
  var fialNum = 0;
  var that = this
  var leftCount = num - ons.length; //只能上传9张照片，包括拍照
  if (leftCount <= 0) {
    return;
  }
  var sourceType = [event.currentTarget.dataset.category];
  wx.chooseImage({
    count: leftCount, //这个是上传的最大数量，默认为9
    sizeType: ['original'],
    sourceType: sourceType, //这个是图片来源，相册或者相机
    success(res) {
      wx.showLoading({
        title: '正在处理...',
      })
      var tempFiles = res.tempFiles;
      that.number(i, fialNum, tempFiles, ons, route, _this)
    },
  })
}

function number(i, fialNum, tempFiles, ons, route, _this) {
  console.log('-------------->', i)
  if (i < tempFiles.length) {
    if ((tempFiles[i].size) < 500000) {
      this.uploadCanvasImg(tempFiles[i].path, tempFiles, i, fialNum, ons, route, _this);
    } else {
      this.getImgInfo(tempFiles[i].path, tempFiles, i, fialNum, ons, route, _this)
    }
  }
}


function getImgInfo(tempFilePaths, tempFiles, i, fialNum, ons, route, _this) {
  console.log('getImgInfo接收的参数长度为:' + arguments.length);
  var that = this
  wx.getImageInfo({
    src: tempFilePaths,
    success(res) {
      var ratio = res.width / res.height
      // 目标尺寸
      if (res.type == 'gif') {
        that.uploadCanvasImg(res.path, tempFiles, i, fialNum, ons, route, _this);
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
                    //调用uploadCanvasImg()
                    that.uploadCanvasImg(res.tempFilePath, tempFiles, i, fialNum, ons, route, _this);
                  },
                  fail() {
                    i += 1
                    fialNum += 1;
                    that.number(i, fialNum, tempFiles, ons, route, _this)
                    wx.showToast({
                      title: '压缩失败' + fialNum + '张',
                      icon: 'none'
                    })
                  }
                }, this)
              }, 200)
            })
          }
        })
      }
    }
  })
}

function uploadCanvasImg(res, tempFiles, i, fialNum, ons, route, _this) {
  var that = this
  let timestamp = Math.round(new Date());
  const filePath = res;
  const cloudPath = route+ timestamp  + filePath.match(/\.[^.]+?$/)[0]
  wx.cloud.uploadFile({
    cloudPath,
    filePath,
    success: res => {
      wx.hideLoading()
      ons.push(res.fileID)
      _this.setData({
        ons
      })
    },
    fail(err) {
      wx.hideLoading()
      wx.showToast({
        title: '压缩失败！',
        icon: 'none'
      })
    },
    complete(com) {
      i += 1
      that.number(i, fialNum, tempFiles, ons, route, _this)
    }
  })
}

module.exports = {
  chooseImage,
  number,
  getImgInfo,
  uploadCanvasImg
}