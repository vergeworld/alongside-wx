const db = wx.cloud.database();
const sy = require('../../../../../js/system.js')
var id 
Page({
  data: {
    page: 0,
    postList: [],
  },
  onLoad: function (e) {
    sy.system(391,this)
    id = e.id
    var that = this;
    db.collection("express").doc(id).get({
      success(res) {
        var postList =  that.data.postList
        postList[0] = res.data;
        that.setData({
         postList
        })
      }
    })
  },

  pay() {
    var body = '快递超市';
    var fee = this.data.postList[0].price*100;
    console.log(fee)
    var timestamp = Math.round(new Date());
    wx.cloud.callFunction({
      name: 'pay',
      data: {
        body: body,
        fee: fee,
        order: timestamp,
      },
      success(res) {
        var payData = res.result;
        wx.requestPayment({
          timeStamp: payData.timeStamp,
          nonceStr: payData.nonceStr,
          package: payData.package,
          signType: 'MD5',
          paySign: payData.paySign,
          success(res) {
            db.collection("express").doc(id).update({
              data:{
                status:''
              }
            })
            wx.navigateBack()
          },
          fail(res) {}
        })
      },
      fail(err) {
        wx.showToast({
          title: '支付失败',
        })
      }
    })
  },

  service(){
    wx.navigateTo({
      url: '../../../../my/service/service',
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})