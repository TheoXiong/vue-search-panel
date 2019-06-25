export const parseTime = (time, cFormat) => {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return timeStr
}

export const removeFromArray = (arr, propName, target) => {
  let index = arr.findIndex(item => {
    return item[propName] === target[propName]
  })
  index >= 0 ? arr.splice(index, 1) : ''
}

export const isInArray = (arr, propName, target) => {
  return arr.some(item => {
    return item[propName] === target[propName]
  })
}

export const truncateText = (str, len, ellipsis = '...') => {
  if (!(typeof str === 'string' && typeof len === 'number' && typeof ellipsis === 'string' && (len > ellipsis.length))) {
    throw new Error('Invalid params.')
  }
  if (str.length <= len) {
    return str
  } else {
    let contentLen = len - ellipsis.length
    let content = str.slice(0, contentLen)
    return content + ellipsis
  }
}
