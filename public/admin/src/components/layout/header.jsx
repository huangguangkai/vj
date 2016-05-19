
import React from 'react'
import {Link} from 'react-router'
import * as auth from '../../utils/auth'

export default React.createClass({
  handleLogout() {
    auth.removeToken();
    this.props.history.pushState(null, '/login');
  },
  render() {
    return (
      <header className="header">
      <Link className="logo" to="/">
      <em>VJ管理后台</em>
      </Link>
      <div className="right">
      <ul>
        <li>
        <a onClick={this.handleLogout} href='javascript:;'>退出</a>
        </li>
      </ul>
      </div>
      </header>
    )
  }
})