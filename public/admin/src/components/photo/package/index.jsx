
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
          <NavItem href={`#/photo/package?delete_status=${DELETE_STATUS.DEFAULT}`}>展示中</NavItem>
          <NavItem href={`#/photo/package?delete_status=${DELETE_STATUS.DELETED}`}>已隐藏</NavItem>
        </Nav>
        <Navbar.Collapse>
          <Nav pullRight>
            <NavItem href="#/photo/package/create">新增套餐</NavItem>
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
        <th>照片</th>
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
                  nameImage={item.name_image}
                  name={item.name}
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
              <p>套餐名：{item.name || '无'}</p>
              <p>套餐描述：{item.description || '无'}</p>
              <p>
              分类：
              <select
              onChange={props.handleCategory}
              data-index={i}
              value={item.category_id}>
                <option value="0">无分类</option>
                {((categories) => {
                  return categories.map(function (category, c) {
                    return (<option
                      key={`${category.id}_${c}`}
                      value={category.id}>
                      {category.name}</option>)
                  });
                })(categories)}
              </select>

              </p>
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
              href={`#/photo/package/${item.id}`}
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
  dataUrl: '/photos/packages',
  getInitialState() {
    return {
      data: null,
      categories: null,
      loading: false,
      empty: false,
    }
  },
  setLoading(loading) {
    this.setState({loading});
  },
  setEmpty(empty) {
    this.setState({empty});
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
  putPackageById(id, body) {
    return xhr.put(`${this.dataUrl}/${id}`, body)
  },
  putPhotosByPid(id, body) {
    return xhr.put(`/photo_packages/${id}/photos`, body)
  },
  handleData(props) {
    const self = this;
    const state = self.state;
    props = props || self.props;
    const query = self.getQuery(props);

    self.setLoading(true);

    $.when(
      self.getData(query),
      props.api.getPhotoCategories())
    .done(function () {
      let data = arguments[0][0];
      let categories = arguments[1][0];

      self.setState({data, categories}, function () {
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

    props.history.push({
      pathname: `${props.location.pathname}`,
      query: {
        page: page,
        perpage: query.perpage
      }
    });
  },
  handleCategory(e) {
    const target = e.target;
    const cid = Number(target.value);

    const self = this;
    const state = self.state;

    const selectedIndex = target.selectedIndex;

    const index = target.dataset.index;
    const item = state.data.data[index];

    const cname = target[selectedIndex].innerText;

    const newObj = {
      category_id: cid,
      category_name: cname,
    };

    const data = update(state.data, {
      data: {
        [index]: {
          $merge: newObj
        }
      }
    });

    self.putPackageById(item.id, newObj);
    self.putPhotosByPid(item.id, newObj);
    self.setState({data});
  },
  handleShow(e) {

    const self = this;
    const state = self.state;

    const target = e.target;
    const index = target.dataset.index;
    const item = state.data.data[index];
    const id = item.id;

    self.putPackageById(id, {
      delete_status: DELETE_STATUS.DEFAULT
    })
    .done(function (ret) {
      self.handleData(self.props);
    });
  },
  handleHide(e) {

    const self = this;
    const state = self.state;

    const target = e.target;
    const index = target.dataset.index;
    const item = state.data.data[index];
    const id = item.id;

    self.putPackageById(id, {
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
                handleCategory={self.handleCategory}
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