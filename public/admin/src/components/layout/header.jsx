
import React from 'react'
import {Link} from 'react-router'
import * as auth from '../../utils/auth'
import xhr from '../../utils/jquery.xhr'

export default React.createClass({
  handleLogout() {
    const self = this;

    xhr.get('/auth/logout')
    .done(function (ret) {
      auth.removeToken();
      self.props.history.pushState(null, '/login');
    })
  },
  render() {
    return (
      <header className="header">
      <Link className="logo" to="/dashboard">
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