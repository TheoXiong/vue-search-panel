export function setStorage (key, value = '') {
  try {
    localStorage.setItem(key, value)
  } catch (error) {
    console.error('[setStorage] Error: ', error)
    return ''
  }
}

export function getStorage (key) {
  try {
    return localStorage.getItem(key)
  } catch (error) {
    console.error('[getStorage] Error: ', error)
    return ''
  }
}

export function clearStorage (key) {
  try {
    return localStorage.removeItem(key)
  } catch (error) {
    console.error('[clearStorage] Error: ', error)
    return ''
  }
}

export function setStorageJson (key, value = '') {
  try {
    setStorage(key, JSON.stringify(value))
  } catch (error) {
    console.error('[setStorageJson] Error: ', error)
    return ''
  }
}

export function getStorageJson (key) {
  try {
    return JSON.parse(getStorage(key))
  } catch (error) {
    console.error('[getStorageJson] Error: ', error)
    return ''
  }
}
