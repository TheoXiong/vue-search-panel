/**
 * debounce
 */

const _count = Symbol('_count')
const _threshold = Symbol('_threshold')

class Debounce {
  constructor (threshold) {
    this[_count] = 0
    this[_threshold] = (typeof threshold === 'number' && threshold > 17) ? threshold : 100
  }
  update () {
    if (this[_count] >= 0xFFFFFFFE) {
      this[_count] = 0
    }
    this[_count]++
  }
  do (cb = () => {}, ...args) {
    this.update()
    let currCnt = this[_count]

    setTimeout(() => {
      currCnt !== this[_count] ? '' : cb(...args)
    }, this[_threshold])
  }
}

export default Debounce
