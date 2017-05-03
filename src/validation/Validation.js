import basicRules from './rules'

let scrollTid = null
const scrollToError = () => {
  if (scrollTid) {
    clearTimeout(scrollTid)
  }
  scrollTid = setTimeout(() => {
    const errorBoundingTop = [].reduce.call(document.querySelectorAll('.widget-form__group--error'), (next, elem) => {
      return Math.min(elem.getBoundingClientRect().top, next)
    }, Infinity)
    if (errorBoundingTop === Infinity) {
      return
    }
    window.scrollTo(0, window.scrollY + errorBoundingTop - 10)
  }, 50)
}

export default class Validation {

  constructor(host, validationList) {
    this.result = {}
    this.rulesMap = {}
    this.changedMap = {}
    this.childValidtion = {}
    this.host = host

    Object.keys(validationList).forEach(key => {
      this.result[key] = true
      this.rulesMap[key] = (...args) => {
        let rules = validationList[key]
        if (!(rules instanceof Array)) {
          rules = [rules]
        }
        let result = true
        rules.every(rule => {
          let ruleResult
          let type = rule.type ? rule.type : rule
          let msg = rule.msg
          if (typeof rule === 'function') {
            ruleResult = rule(...args)
          } else if (basicRules[type]) {
            ruleResult = basicRules[type](...args)
          } else {
            console.warn(`unknow validation rule -- ${rule}`)
            return true
          }
          if (ruleResult === undefined || ruleResult === true) {
            return true
          }
          result = msg || ruleResult
          return false
        })
        this.result[key] = result
        return result
      }
    })
  }

  getResult() {
    return this.result
  }

  markChanged(name) {
    this.changedMap[name] = true
  }

  reset() {
    this.result = {}
    this.changedMap = {}
    this.childValidtion = {}
  }

  run(name, value, state) {
    state = {
      ...state,
      [name]: value
    }
    Object.keys(this.rulesMap).forEach(key => {
      if (name === key) {
        this.result[key] = this.rulesMap[key](value, state, this.changedMap)
        return
      }
      if (this.changedMap[key]) {
        this.result[key] = this.rulesMap[key](state[key], state, this.changedMap)
      }
    })
  }

  merge(name, validation) {
    this.childValidtion[name] = validation
  }

  isValid(value) {
    Object.keys(this.rulesMap).forEach(key => {
      this.changedMap[key] = true
    })
    this.run(null, null, value || this.host.state)
    this.host.forceUpdate()
    const result = this.getResult()

    const keyResult = Object.keys(result)
      .every(key => typeof result[key] !== 'string')

    let childResult = true
    Object.keys(this.childValidtion)
      .forEach(key => {
        if (!this.childValidtion[key].isValid()) {
          childResult = false
        }
      })

    const final = keyResult && childResult

    if (!final) {
      scrollToError()
    }

    return final
  }
}
