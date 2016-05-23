import React from 'react'
import { Route, Link } from 'react-router'

import Header from './layout/header.jsx'
import Nav from './layout/nav.jsx'
import xhr from '../utils/jquery.xhr'

export default React.createClass({
  renderChildren() {
    const self = this;
    const props = self.props;
    const state = self.state;
    const children = props.children;

    return React.Children.map(children, function (child) {
      return React.cloneElement(child, {
        api: self.api
      })
    })
  },
  api: {
    getUptoken(query) {
      return xhr.get('/qiniu/uptoken', query);
    },
    getPhotoCategories(query) {
      return xhr.get('/photos/categories', query);
    },
    putPackageById(id, body) {
      return xhr.put(`/photos/packages/${id}`, body);
    },
    putPhotosByPid(id, body) {
      return xhr.put(`/photo_packages/${id}/photos`, body)
    },
    putVideoById(id, body) {
      return xhr.put(`/videos/${id}`, body)
    },
  },
  componentDidMount() {
    var $main = $(this.refs.main);

    $main.height(window.innerHeight - 49);
    window.addEventListener('resize', function () {
      $main.height(this.innerHeight - 49);
    });

  },
  shouldComponentUpdate(nextProps, nextState) {
    return (this.props !== nextProps);
  },
  render() {
    const self = this;
    const props = self.props;
    const state = self.state;

    return (
      <div>
        <Header history={props.history}/>
        <div ref="main" className="main">
        <Nav history={props.history}/>
        <div className="content">
        {this.renderChildren()}
        </div>
        </div>
      </div>
    )
  }
})