let showModal =  function (_this) {
  // 显示遮罩层
  var animation = wx.createAnimation({
    duration: 200,
    timingFunction: "linear",
    delay: 0
  })
  _this.animation = animation
  animation.translateY(300).step()
  _this.setData({
    animationData: animation.export(),
    showModalStatus: true
  })
  setTimeout(function () {
    animation.translateY(0).step()
    _this.setData({
      animationData: animation.export()
    })
  }.bind(_this), 200)
};

let hideModal = function (_this) {
  // 隐藏遮罩层
  var animation = wx.createAnimation({
    duration: 200,
    timingFunction: "linear",
    delay: 0
  })
  _this.animation = animation
  animation.translateY(300).step()
  _this.setData({
    animationData: animation.export(),
  })
  setTimeout(function () {
    animation.translateY(0).step()
    _this.setData({
      animationData: animation.export(),
      showModalStatus: false
    })
  }.bind(_this), 200)
};

module.exports = {
  showModal,
  hideModal
}