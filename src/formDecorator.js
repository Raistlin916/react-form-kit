import React from 'react'
import Validation from './validation'

export default (formOnChange, state, validation) => {
  if (!state) {
    state = {}
    console.warn('form need state props')
  }
  if (!formOnChange) {
    return elem => elem
  }
  return (elem, options) => {
    options = options || {}
    const name = elem.props.name
    if (!name) {
      console.warn(`${elem.type.name} -- name shouldn't be empty`)
    }
    if (state[name] === undefined) {
      console.warn(`${name} has no value in state`)
    }
    const targetProps = {
      onChange(e) {
        const value = e.target ? e.target.value : e
        if (validation) {
          validation.markChanged(name)
          validation.run(name, value, state)
        }
        formOnChange(name, value, e)
        if (elem.props.onChange) {
          return elem.props.onChange(e)
        }
      },
      key: name,
      ref: ins => {
        if (ins && ins.validation instanceof Validation) {
          validation.merge(name, ins.validation)
        }
        if (ins && ins.props && ins.props.instance) {
          ins.props.instance(ins)
        }
      }
    }
    if (options.value !== false) {
      targetProps.value = state[name]
    }

    const handledElement = React.cloneElement(elem, targetProps)

    if (validation) {
      const validationResult = validation.getResult()[name]
      if (validationResult !== undefined) {
        if (typeof validationResult === 'string') {
          return (
            <div className="widget-form__group-row widget-form__group--error">
              {handledElement}
              <p
                className="widget-form__error-desc"
                key={`error-${name}`}
              >{validationResult}</p>
            </div>
          )
        } else if (validationResult !== true) {
          console.warn(`${name} of validation should return string value`)
        }
      }
    }

    return <div className="widget-form__group-row">{handledElement}</div>
  }
}
