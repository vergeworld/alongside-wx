function chooseImage(upImgs, num, route, _this) {
  wx.chooseMedia({
    count: num,
    mediaType: ['image'],
    sourceType: ['album', 'camera'],
    maxDuration: 30,
    camera: 'back',
    success(res) {
      wx.showLoading({
        title: '正在上传...',
      })
      for (let i = 0; i < res.tempFiles.length; i++) {
        var tempPath = res.tempFiles[i].tempFilePath;
         uploadCanvasImg(tempPath, upImgs, route, _this)
      }
    },
  })
}

function uploadCanvasImg(tempPath, upImgs, route, _this) {
  console.log(tempPath);
  let timestamp = Math.round(new Date());
  const filePath = tempPath;
  const cloudPath = route + timestamp + filePath.match(/\.[^.]+?$/)[0]
  console.log(cloudPath);
  wx.cloud.uploadFile({
    cloudPath,
    filePath,
    success: res => {
      wx.hideLoading()
      upImgs.push(res.fileID)
      _this.setData({
        upImgs
      })
    },
    fail(err) {
      wx.showToast({
        title: '网络异常，请稍后重试',
        icon: 'none'
      })
    },
  })
}

module.exports = {
  chooseImage,
}