'use strict';

/**
 * 翻页组件
 * todo
 */

const React = require('react');
const Pagination = require('react-bootstrap/lib/Pagination');

const PaginationAdvanced = React.createClass({
  getDefaultProps() {
    return {
      perpage: 20
    }
  },

  handleSelect(page) {
    const props = this.props;
    props.onSelect && props.onSelect.apply(null, arguments);
  },
  handleItems() {
    const props = this.props;
    return Math.ceil(props.count / props.perpage)
  },

  render() {

    const props = this.props;
    const items = this.handleItems();

    if (items > 1) {
      return (
        <div className="pagination-wrap">
          <Pagination
          prev
          next
          first
          last
          ellipsis
          items={items}
          maxButtons={5}
          activePage={Number(props.page)}
          onSelect={this.handleSelect} />
        </div>
      );
    } else {
      return (<div></div>);
    }
  }
});

module.exports = PaginationAdvanced;