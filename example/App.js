import React, { Component } from 'react'
import { Form, FormItem } from '../src'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      age: null
    }
    this.onChange = this.onChange.bind(this)
  }
  onChange(name, value) {
    this.setState({
      [name]: value
    })
  }
  render() {
    return (
      <Form state={this.state} onChange={this.onChange}>
        {bindField =>
          <div>
            <FormItem label="username:">
              {bindField(<input type="text" name="username" />)}
            </FormItem>
            <FormItem label="age:">
              {bindField(<input type="number" name="age" />)}
            </FormItem>
            <button type="submit">submit</button>
          </div>
        }
      </Form>
    )
  }
}
