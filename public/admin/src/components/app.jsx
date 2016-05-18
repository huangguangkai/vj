import React from 'react'
import { Route, Link } from 'react-router'

export default React.createClass({
  render() {
    return (
      <div>
        <header>
          Links:
          {' '}
          <Link to="/">Home</Link>
        </header>
        <div style={{ marginTop: '1.5em' }}>{this.props.children}</div>
      </div>
    )
  }
})