
import React from 'react'
import * as auth from '../utils/auth'
import update from 'react-addons-update'
import xhr from '../utils/jquery.xhr'

const Login = React.createClass({
  getInitialState() {
    return {
      fields: {
        username: '',
        password: '',
      }
    }
  },
  setFields(fields) {
    this.setState({fields});
  },
  handleLogin(e) {
    e.preventDefault();
    const self = this;
    const state = self.state;
    const props = self.props;
    const fields = state.fields;

    if (fields.username && fields.password) {
      xhr.post('/auth/login', fields)
      .done(function (ret) {
        const token = ret.token;
        if (token) {
          self.props.history.replaceState(null, '/admin');
          auth.storeToken(token);
        }
      })
    }
  },
  handleFields(e) {
    let target = e.target;
    let nextFields = update(this.state.fields, {
      $merge: {
        [target.name]: target.value,
      },
    });

    this.setFields(nextFields);
  },
  render() {
    const self = this;
    const state = self.state;
    const fields = state.fields;
    const username = fields.username;
    const password = fields.password;

    return (
      <form style={{
        margin: '40px auto 0',
        padding: '15px',
        maxWidth: '330px',
        textAlign: 'center',
      }} onSubmit={this.handleLogin}>
        <h2>VJ管理后台</h2>
        <input
        className="form-control"
        style={{
          marginBottom: '-1px',
          borderBottomRightRadius: 0,
          borderBottomLeftRadius: 0,
          padding: '10px',
          fontSize: '16px',
          height: 'auto'
        }}
        type="text"
        name="username"
        value={username}
        placeholder="账号"
        onChange={this.handleFields}/>

        <input
        className="form-control"
        style={{
          marginBottom: '10px',
          borderTopRightRadius: 0,
          borderTopLeftRadius: 0,
          padding: '10px',
          fontSize: '16px',
          height: 'auto'
        }}
        type="password"
        name="password"
        value={password}
        placeholder="密码"
        onChange={this.handleFields}/>

        <button type="submit"
        className="btn btn-primary btn-lg btn-block">
        Sign in</button>
      </form>
    );
  },
});

export default Login
