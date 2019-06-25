const panelSignMap = {
  search: '~',
  recently: '&',
  command: '>',
  favorite: '#',
  help: ''
}

const helpList = [
  { key: 'search', value: `${panelSignMap.search}`, tip: 'Go to search panel', shortcut: 'Shift + S' },
  { key: 'recently', value: `${panelSignMap.recently}`, tip: 'Go to recently panel', shortcut: 'Shift + R' },
  { key: 'command', value: `${panelSignMap.command}`, tip: 'Go to command panel', shortcut: 'Shift + C' },
  { key: 'favorite', value: `${panelSignMap.favorite}`, tip: 'Go to favorite panel', shortcut: 'Shift + F' }
]

const commandList = [
  { key: 'go-new', value: 'Go: New' },
  { key: 'reload-window', value: 'Window: Reload' },
  { key: 'alert-info', value: 'Alert: some info' }
]

const favoriteList = [
  { key: 'github', value: 'https://github.com/', alter: 'GitHub' },
  { key: 'vuejs', value: 'https://cn.vuejs.org/', alter: 'VUE' },
  { key: 'react', value: 'https://reactjs.org/', alter: 'React' },
  { key: 'flutter', value: 'https://flutter.dev/', alter: 'Flutter' },
  { key: 'npm', value: 'https://www.npmjs.com/', alter: 'NPM' },
  { key: 'w3c', value: 'https://www.w3.org/', alter: 'W3C' },
  { key: 'mdn', value: 'https://developer.mozilla.org/', alter: 'MDN' }
]

export {
  panelSignMap,
  helpList,
  commandList,
  favoriteList
}
