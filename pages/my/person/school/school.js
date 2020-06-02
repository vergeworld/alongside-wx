const db = wx.cloud.database();
var sy = require('../../../../js/system.js')
Page({
  data: {
    array: ['桂林理工大学·空港校区', '广西城市职业大学', '广西科技职业学院', '广西自然资源职业技术学院', '广西外国语学院'],
    objectArray: [{
        id: 0,
        name: '桂林理工大学·空港校区'
      },
      {
        id: 1,
        name: '广西城市职业大学'
      },
      {
        id: 2,
        name: '广西科技职业学院'
      },
      {
        id: 3,
        name: '广西自然资源职业技术学院'
      },
      {
        id: 4,
        name: '广西外国语学院'
      }
    ],
    index: 0,
  },

  onLoad: function (options) {
    var school = wx.getStorageSync('school')
    this.setData({
      school
    })
  },

  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
    wx.showToast({
      title: '修改失败',
      icon: 'none',
      duration: 2000
    })
  },

  save() {
    var school = this.data.school
    if (school) {
      wx.setStorageSync('school', school)
      var id = wx.getStorageSync('id')
      db.collection('user').doc(id).update({
        data: {
          school: school
        },
      })
    }
  }
})