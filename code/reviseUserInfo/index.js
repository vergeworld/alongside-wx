// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
// 云函数入口函数
exports.main = async (event, context) => {
  const openId = cloud.getWXContext().OPENID
  const nickName = event.nickName
  const avatarUrl = event.avatarUrl
  return cloud.database().collection('trips').where({
      _openid: openId
    }).update({
      data: {
        nickName,
        avatarUrl
      }
    })
}