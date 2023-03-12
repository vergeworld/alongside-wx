const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ct:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(e) {
    let id = e.id
    let that = this
    db.collection('source').doc('3').get().then((res) => {
      let ctx = res.data.home.slideshow[id]
      // let content = ctx.content.replace(/(^"+)|("+$)/g, '')
      that.setData({
        ctx
      })
    })

  },


  backHome(){
    wx.navigateBack({
      delta: 1,
    })
  }
})