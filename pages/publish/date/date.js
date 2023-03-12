let customDate = require('../../../js/customDate')
let popup = require('../../../js/popup')
let date = new Date()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    days: customDate.days,
    hours: customDate.hours,
    minutes: customDate.minutes,
    value: [0, date.getHours(), Math.floor(date.getMinutes() / 10)],
    day: customDate.days[0],
    hour: customDate.hours[date.getHours()],
    minute: customDate.minutes[Math.floor(date.getMinutes() / 10)],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
     banner : wx.getStorageSync('source').publish.date.banner
    })
    popup.showModal(this)
  },

  /*
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    let day = this.data.day
    let setDate = day.slice(0, day.length-3) + ' ' + this.data.hour + this.data.minute
    wx.setStorageSync('setDate', setDate)
  },


  // 自定义方法
  bindChange(e) {
    const val = e.detail.value
    this.setData({
      day: this.data.days[val[0]],
      hour: this.data.hours[val[1]],
      minute: this.data.minutes[val[2]],
      value: val
    })
  },

  backPublish() {
    wx.navigateBack({
      delta: 0,
    })
  }
})