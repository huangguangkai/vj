import React from 'react'
import { Route, Link } from 'react-router'

import Header from './layout/header.jsx'
import Nav from './layout/nav.jsx'

export default React.createClass({
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
  componentDidMount() {
    var $main = $(this.refs.main);

    $main.height(window.innerHeight - 49);
    window.addEventListener('resize', function () {
      $main.height(this.innerHeight - 49);
    });

  },
  render() {
    const self = this;
    const props = self.props;

    return (
      <div>
        <Header history={props.history}/>
        <div ref="main" className="main">
        <Nav history={props.history}/>
        <div className="content">{this.renderChildren()}</div>
        </div>
      </div>
    )
  }
})