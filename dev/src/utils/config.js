const panelSignMap = {
  search: '~',
  recently: '&',
  command: '>',
  help: ''
}

const helpList = [
  { key: 'search', value: `${panelSignMap.search}`, tip: 'Go to search panel', shortcut: 'Shift + S' },
  { key: 'recently', value: `${panelSignMap.recently}`, tip: 'Go to recently panel', shortcut: 'Shift + R' },
  { key: 'command', value: `${panelSignMap.command}`, tip: 'Go to command panel', shortcut: 'Shift + C' }
]

const commandList = [
  { key: 'go-back', value: 'Go: Back' },
  { key: 'go-forward', value: 'Go: Forward' },
  { key: 'go-new', value: 'Go: New' },
  { key: 'reload-window', value: 'Window: Reload' }
]

export {
  panelSignMap,
  helpList,
  commandList
}
