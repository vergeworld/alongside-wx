  // 图片展示
  function img(postList, page, imgW, imgH,imgM, _this) {
    for (var i = 0; i < postList.length; i++) {
      var number = postList[i].img.length
      i = i + page
      if (number == 1) {
        imgW[i] = 491
        imgH[i] = 400
        imgM[i] = 'widthFix'
      } else if (number == 2 || number == 4) {
        imgW[i] = 243
        imgH[i] = 240
        imgM[i] = 'aspectFill'
      } else {
        imgW[i] = 237
        imgH[i] = 235
        imgM[i] = 'aspectFill'
      }
      i = i - page
    }
    _this.setData({
      imgW,
      imgH,
      imgM
    })
  }

  function preview(e,postList){
    var i = e.currentTarget.id
    var src = e.currentTarget.dataset.src; 
    var imgList = postList[i].img; 
    wx.previewImage({
      current: src, 
      urls: imgList 
    })
  }

  module.exports = {
    img,
    preview
  }