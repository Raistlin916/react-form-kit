import React, { Component } from 'react'
import { Form } from '../src'

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
    const { username, age } = this.state
    return (
      <Form state={this.state} onChange={this.onChange}>
        {bindField =>
          <div>
            {bindField(<input type="text" name="username" placeholder="username" />)}
            {bindField(<input type="number" name="age" placeholder="age" />)}
            <hr />
            <p>username: { username }</p>
            <p>age: { age }</p>
          </div>
        }
      </Form>
    )
  }
}
