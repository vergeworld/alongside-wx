const date = new Date()
const months = []
const days = []
const hours = []
const minutes = []


let daysLen = 7;
let month = date.getMonth() + 1
let day = date.getDate()
let week = date.getDay();
let setDate = new Date()
setDate.setDate(32)
let dates = 32 - setDate.getDate()
if (day + daysLen > dates) {
  let nextMonth = month + 1;
  let nowDates = dates - day;
  let nextDates = daysLen - nowDates;
  for (let i = 0; i <= nowDates; i++) {
    days.push(month + '月' + day + '日');
    day += 1;
  }
  for (let i = 1; i < nextDates; i++) {
    days.push(nextMonth + '月' + i + '日');
  }
} else {
  for (let i = 0; i < daysLen; i++) {
    days.push(month + '月' + day + '日');
    day += 1;
  }
}
week = 2
const weeks = ['今天', '明天', '后天', '周一', '周二', '周三', '周四', '周五', '周六', '周日', '下周一', '下周二', '下周三', '下周四', '下周五', '下周六', ]
for (let i = 0; i < days.length; i++) {
  if (i < 3) {
    days[i] += ' ' + weeks[i]
  } else {
    days[i] += ' ' + weeks[week + i + 2]
  }
}
for (let i = 0; i < 24; i++) {
  hours.push(i + '时')
}

for (let i = 0; i < 6; i++) {
  minutes.push(i + '0' + '分')
}

module.exports = {
  months,
  days,
  hours,
  minutes
}