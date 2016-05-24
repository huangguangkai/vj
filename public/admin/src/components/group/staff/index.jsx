
import React from 'react'
import update from 'react-addons-update'
import {
  Navbar,
  Nav,
  NavItem,
} from 'react-bootstrap'

import xhr from '../../../utils/jquery.xhr'
import {Loading, Empty} from '../../../ui/react.loading.jsx'
import Pagination from '../../../ui/react.pagination.jsx'
import Cover from '../../../ui/react.cover.jsx'
import moment from 'moment'

const DELETE_STATUS={
  DEFAULT: 0,
  DELETED: 1
};

const Bar = React.createClass({
  render() {
    return (
      <Navbar>
        <Nav>
          <NavItem href={`#/group/staff?delete_status=${DELETE_STATUS.DEFAULT}`}>展示中</NavItem>
          <NavItem href={`#/group/staff?delete_status=${DELETE_STATUS.DELETED}`}>已隐藏</NavItem>
        </Nav>
        <Navbar.Collapse>
          <Nav pullRight>
            <NavItem href="#/group/staff/create">新增</NavItem>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
});

const List = React.createClass({
  render() {
    const self = this;
    const props = self.props;
    const state = self.state;
    const data = props.data;
    const categories = props.categories;

    return (

      <table className="table table-hover table table-bordered table-striped">
      <thead>
      <tr>
        <th>封面</th>
        <th>详情</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      {((data) => {
        return data.data.map(function (item, i) {
          return (
            <tr key={`${item.id}_${i}`}>
              <td style={{
                width: '320px'
              }}>
              <img src={`${item.cover_url}?imageView2/2/w/320`} width="320"/>
              </td>
              <td style={{
                width: '50%',
                wordBreak: 'break-all'
              }}>
              <p>名称：{item.name || '无'}</p>
              <p>权重：{item.index}</p>
              {((url) => {
                if (url) {
                  return (
                    <p>链接：
                    <a href={url} target="_blank">点击访问</a>
                    </p>
                  )
                }

              })(item.url)}
              <p>创建时间：{moment(item.created_at).format('YYYY-MM-DD HH:mm:ss')}</p>
              </td>
              <td>
              {((item) => {
                if (item.delete_status === DELETE_STATUS.DEFAULT) {
                  return (
                    <button
                    style={{
                      marginRight: '10px'
                    }}
                    className="btn btn-danger"
                    data-index={i}
                    onClick={props.handleHide}>
                    隐藏</button>
                  )
                } else if (item.delete_status === DELETE_STATUS.DELETED) {
                  return (
                    <button
                    style={{
                      marginRight: '10px'
                    }}
                    className="btn btn-primary"
                    data-index={i}
                    onClick={props.handleShow}>
                    展示</button>
                  )
                }

              })(item)}
              <a
              href={`#/group/staff/${item.id}`}
              className="btn btn-default"
              >编辑</a>
              </td>
            </tr>
          )
        });
      })(data)}
      </tbody>
      </table>

    )
  }
});

export default React.createClass({
  dataUrl: '/staffs',
  getInitialState() {
    return {
      data: null,
      loading: false,
      empty: false,
    }
  },
  setLoading(loading) {
    this.setState({loading});
  },
  getQuery(props) {
    const query = props.location.query;
    return {
      page: query.page || 1,
      perpage: query.perpage || 20,
      delete_status: query.delete_status || DELETE_STATUS.DEFAULT
    }
  },
  getData(query) {
    return xhr.get(this.dataUrl, query)
  },
  handleData(props) {
    const self = this;
    const state = self.state;
    props = props || self.props;
    const query = self.getQuery(props);

    self.setLoading(true);

    self.getData(query).done(function (data) {

      self.setState({data}, function () {
        self.setLoading(false);
      });
    })
    .always(function () {
    });
  },
  handlePage(page) {
    const self = this;
    const props = self.props;
    const query = self.getQuery(props);
    query.page = page;

    props.history.push({
      pathname: `${props.location.pathname}`,
      query: query
    });
  },
  handleShow(e) {

    const self = this;
    const state = self.state;
    const props = self.props;

    const target = e.target;
    const index = target.dataset.index;
    const item = state.data.data[index];
    const id = item.id;

    props.api.putStaffById(id, {
      delete_status: DELETE_STATUS.DEFAULT
    })
    .done(function (ret) {
      self.handleData(self.props);
    });
  },
  handleHide(e) {

    const self = this;
    const state = self.state;
    const props = self.props;

    const target = e.target;
    const index = target.dataset.index;
    const item = state.data.data[index];
    const id = item.id;

    props.api.putStaffById(id, {
      delete_status: DELETE_STATUS.DELETED
    })
    .done(function (ret) {
      self.handleData(self.props);
    });
  },
  componentWillMount() {
    this.handleData(this.props);
  },
  componentWillReceiveProps(nextProps) {
    this.handleData(nextProps);
  },
  render() {
    const self = this;
    const props = self.props;
    const state = self.state;
    const data = state.data;
    const query = self.getQuery(props);

    return (
      <div>
        <Bar/>
        {(() => {
          if (!state.loading) {
            if (data.data.length > 0) {
              return (
                <div>
                <List
                handleShow={self.handleShow}
                handleHide={self.handleHide}
                {...props}
                {...state}/>

                <Pagination
                count={data.count}
                page={query.page}
                perpage={query.perpage}
                onSelect={self.handlePage} />
                </div>
              )
            } else {
              return <Empty/>
            }
          } else {
            return <Loading/>
          }
        })()}
      </div>
    )
  }
})