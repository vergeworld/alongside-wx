/*
 * 保存图片到相册
 */
function saveImgToLocal(imagePath, msg) {
  //判断用户是否授权"保存到相册"
  wx.getSetting({
    success(res) {
      if (res.authSetting['scope.writePhotosAlbum']) {
        savePhoto(imagePath, msg);
      } else if (res.authSetting['scope.writePhotosAlbum'] === undefined) {
        wx.authorize({
          scope: 'scope.writePhotosAlbum',
          success() {
            savePhoto(imagePath, msg);
          },
          fail() {
            wx.showModal({
              title: '您没有授权，无法保存到相册',
              confirmText: "知道了",
              showCancel: false,
              success: function (res) {
                if (res.confirm) {} else if (res.cancel) {}
              }
            })
          }
        })
      } else {
        wx.openSetting({
          success(res) {
            if (res.authSetting['scope.writePhotosAlbum']) {
              savePhoto(imagePath, msg);
            } else {
              wx.showModal({
                title: '您没有授权，无法保存到相册',
                confirmText: "知道了",
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {} else if (res.cancel) {}
                }
              })
            }
          }
        })
      }
    }
  })
}

function savePhoto(imagePath, msg) {
  wx.saveImageToPhotosAlbum({
    filePath: imagePath,
    success(res) {
      wx.showToast({
        title: '已保存到相册'
      })
    }
  })
}
//方法对外开放（开放才能从外部调用）
module.exports = {
  saveImgToLocal: saveImgToLocal
}