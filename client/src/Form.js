import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField';

export default class Form extends Component {
  state ={
    text: ""
  }

  handleOnChange = (e) => {
    const newText = e.target.value
    this.setState({ text: newText })
  }

  handleOnSubmit = (e) => {

  }

  render() {
    const { text } = this.state
    return (
      <div style={{ textAlign: 'center' }}>
        <TextField
          style={{ display: 'inline-block' }}
          label="New task"
          margin="dense"
          onChange={(e) => this.handleOnChange(e)}
          onSubmit={(e) => this.handleOnSubmit(e)}
          value={text}
        />
      </div>
    )
  }
}
