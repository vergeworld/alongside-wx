var util = require("../../../utils/util.js");
const db = wx.cloud.database();
Page({
  data: {
    time: ''
  },
  onLoad: function (e) {
    this.system()
    var id = e.id;
    var that = this
    db.collection("_swiper").get({
      success(res) {
        var notice = res.data[0].drive.notice
        db.collection('drive').doc(id).get({
          success(res) {
            that.setData({
              notice,
              drive: res.data.drive,
              id: id
            })
          }
        })
      }
    })
  },

  // 获取屏幕高度
  system() {
    var that = this
    wx.getSystemInfo({
      complete: (res) => {
        console.log(res)
        that.setData({
          screen_height: res.windowHeight - 380
        })
      },
    })
  },

  formSubmit(a) {
    var v = a.detail.value;
    if (!v.input1 || !v.input2 || !v.input4 || !v.sex) {
      wx.showModal({
        title: '提示',
        content: '信息填写不完整！',
      })
    } else {
      const _ = db.command
      db.collection('drive').doc(this.data.id).update({
        data: {
          sign: _.inc(1)
        }
      })
      db.collection("drive_sign").add({
        data: {
          title: v.input0,
          name: v.input1,
          sex: v.sex,
          phone: v.input2,
          address: v.input4,
          time: util.formatTime(new Date())
        },
        success(res) {
          wx.showModal({
            title: '提示',
            content: '提交成功！',
            success(res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1
                })
              } else {
                console.log('ok')
              }
            }
          })
        },
        fail(res) {
          wx.showModal({
            title: '提示',
            content: '提交失败'
          })
        },
      })
    }
  }
})