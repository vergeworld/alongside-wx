// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const openId = cloud.getWXContext().OPENID
  const name = event.name
  const url = event.url
  return cloud.database().collection('forum').where({
      _openid: openId
    }).update({
      data: {
        name: name,
        url: url
      }
    }),
    cloud.database().collection('books').where({
      _openid: openId
    }).update({
      data: {
        name: name,
        url: url
      }
    }),
    cloud.database().collection('market').where({
      _openid: openId
    }).update({
      data: {
        name: name,
        url: url
      }
    }),
    cloud.database().collection('lost').where({
      _openid: openId
    }).update({
      data: {
        name: name,
        url: url
      }
    })
}