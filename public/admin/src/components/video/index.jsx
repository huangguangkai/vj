
import React from 'react'
import update from 'react-addons-update'
import {
  Navbar,
  Nav,
  NavItem,
} from 'react-bootstrap'

import xhr from '../../utils/jquery.xhr'
import {Loading, Empty} from '../../ui/react.loading.jsx'
import Pagination from '../../ui/react.pagination.jsx'
import Cover from '../../ui/react.cover.jsx'
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
          <NavItem href={`#/video/list?delete_status=${DELETE_STATUS.DEFAULT}`}>展示中</NavItem>
          <NavItem href={`#/video/list?delete_status=${DELETE_STATUS.DELETED}`}>已隐藏</NavItem>
        </Nav>
        <Navbar.Collapse>
          <Nav pullRight>
            <NavItem href="#/video/create">新增视频</NavItem>
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
              {((item) => {
                if (item.cover_url) {
                  return <Cover
                  nameImage={item.title_image}
                  name={item.title}
                  coverUrl={item.cover_url}/>
                } else {
                  return '无'
                }
              })(item)}
              </td>
              <td style={{
                width: '50%',
                wordBreak: 'break-all'
              }}>
              <p>标题：{item.title || '无'}</p>
              <p>描述：{item.description || '无'}</p>
              <p>视频：
              {((item) => {
                if (item.video_url) {
                  return <a target="_blank" href={item.video_url}>点击查看</a>
                } else {
                  return '无'
                }
              })(item)}
              </p>
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
              href={`#/video/${item.id}`}
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
  dataUrl: '/videos',
  getInitialState() {
    return {
      data: null,
      loading: false,
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
  putVideoById(id, body) {
    return xhr.put(`${this.dataUrl}/${id}`, body)
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
    const props = self.props;
    const state = self.state;

    const target = e.target;
    const index = target.dataset.index;
    const item = state.data.data[index];
    const id = item.id;

    props.api.putVideoById(id, {
      delete_status: DELETE_STATUS.DEFAULT
    })
    .done(function (ret) {
      self.handleData(self.props);
    });
  },
  handleHide(e) {

    const self = this;
    const props = self.props;
    const state = self.state;

    const target = e.target;
    const index = target.dataset.index;
    const item = state.data.data[index];
    const id = item.id;

    props.api.putVideoById(id, {
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