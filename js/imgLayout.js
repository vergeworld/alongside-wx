// 图片展示
var util = require("../utils/util.js");

function imgLayout(postList) {
  for (var i = 0; i < postList.length; i++) {
    postList[i].date = postList[i].date.slice(0, -6)
    postList[i].time = util.getDiffTime(postList[i].time, true);
    var len = postList[i].imgs.length
    if (len == 0) {} else if (len == 1) {
      postList[i].imgW = 672;
      postList[i].imgH = 220;
    } else if (len == 2) {
      postList[i].imgW = 334;
      postList[i].imgH = 166;
      postList[i].mgW = 334;
      postList[i].mgH = 166;
    } else if (len == 3) {
      postList[i].imgW = 446;
      postList[i].imgH = 222;
    } else if (len == 4) {
      postList[i].imgW = 672;
      postList[i].imgH = 200;
    } else if (len == 5) {
      postList[i].imgW = 448;
      postList[i].imgH = 110;
    } else if (len == 6) {
      postList[i].imgW = 448;
      postList[i].imgH = 222;
    } else if (len == 7) {
      postList[i].imgW = 448;
      postList[i].imgH = 334;
    } else if (len == 8) {
      postList[i].imgW = 448;
      postList[i].imgH = 110;
    } else if (len == 9) {
      postList[i].imgW = 448;
      postList[i].imgH = 222;
    }
  }
  return postList
}

module.exports = {
  imgLayout,
}