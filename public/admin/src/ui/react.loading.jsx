
import React from 'react'
import classNames from 'classnames'

export const Empty = React.createClass({
  style: {
    padding: '100px 0',
    textAlign: 'center',
  },
  render() {
    return (
        <div style={this.style}>暂无相关数据</div>
    )
  },
});

export const Loading = React.createClass({
  getDefaultProps() {
    return {
      loading: true
    }
  },
  render() {
    const props = this.props;
    const loading = props.loading;

    const cn = classNames({
      'loading-wrap': true,
      show: loading
    });

    return (
      <div className={cn}>
        <div className="loading">
          <div className="double-bounce1"></div>
          <div className="double-bounce2"></div>
        </div>
        {this.props.children}
      </div>
    )
  },
});