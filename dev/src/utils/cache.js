import { setStorageJson, getStorageJson } from './storage.js'

const isArray = obj => {
  return Object.prototype.toString.call(obj) === '[object Array]'
}

const MAX_CACHE_NUM = 30

const SEARCH_PATH = 'search-path'
const RECENTLY_PATH = 'recently-path'
const COMMAND_PATH = 'command-path'

const takeFromCache = (path) => {
  return getStorageJson(path) || []
}

const saveToCache = (path, item) => {
  if (!path) return
  let caches = getStorageJson(path)
  if (isArray(caches)) {
    let index = caches.findIndex(c => { return item.value === c.value })
    if (index >= 0) {
      caches.splice(index, 1)
      caches.unshift(item)
    } else {
      caches.length >= MAX_CACHE_NUM ? caches.pop() : ''
      caches.unshift(item)
    }
  } else {
    caches = [item]
  }
  setStorageJson(path, caches)
}

export {
  SEARCH_PATH,
  RECENTLY_PATH,
  COMMAND_PATH,
  takeFromCache,
  saveToCache
}
