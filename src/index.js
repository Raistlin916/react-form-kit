import React from 'react'
import classNames from 'classnames'
// import './index.scss'

import Validation from './validation'
import formDecorator from './formDecorator'
import { originRules } from './validation/rules'

const prefix = 'widget-form__'

export const Form = ({ className, children, onChange, state, component, validation, ...rest }) => {
  if (typeof children === 'function') {
    children = children(formDecorator(onChange, state, validation))
  }
  const klass = `${className || ''}`
  const Node = component || 'div'
  return (
    <Node className={klass} {...rest}>{children}</Node>
  )
}

export const FormItem = ({ className, label, labelClass, labelDesc, children, style, inline }) => {
  const klass = classNames({
    [`${prefix}group`]: true,
    [className || '']: true,
    [`${prefix}group--inline`]: inline
  })

  const labelKlass = classNames({
    [`${prefix}label`]: true,
    [labelClass || '']: true
  })

  const labelDescKlass = classNames({
    [`${prefix}label-desc`]: true
  })

  if (typeof children === 'string') {
    children = <FormPreview>{children}</FormPreview>
  }

  return (
    <div className={klass} style={style}>
      <div className={labelKlass}>
        {label || ' '}
        {
          !!labelDesc && (
            <div className={labelDescKlass}>{labelDesc}</div>
          )
        }
      </div>
      {children}
    </div>
  )
}

export const FormPreview = ({ children }) => {
  return (
    <div className={`${prefix}plain-text`}>{children}</div>
  )
}

export { Validation, originRules as rules }
