import React from 'react'
import {Loading} from '../ui/react.loading.jsx'
import xhr from '../utils/jquery.xhr'

const Init = React.createClass({
    render() {
        return <Loading>
        <div style={{
            marginTop: '50px'
        }}>应用初始化中，请稍后...</div>
        </Loading>;
    }
});

export default React.createClass({
  getInitialState() {
    return {
      init: true,
      user: null,
    }
  },
  setUser(user) {
    const self = this;
    this.setState({user});
  },
  renderChildren() {
    const self = this;
    const props = self.props;
    const state = self.state;
    const children = props.children;

    return React.Children.map(children, function (child) {
      return React.cloneElement(child, {
      })
    })
  },
  componentWillMount() {
    const self = this;

    xhr.get('/auth/test')
    .always(function (user) {
      self.setState({
        init: false,
        user: user
      });
    });
  },
  render() {
    const self = this;
    const props = self.props;

    if (this.state.init) {
      return <Init/>
    }
    return <div>{this.renderChildren()}</div>
  }
})