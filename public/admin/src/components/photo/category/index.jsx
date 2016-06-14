
import React from 'react'
import update from 'react-addons-update'

import xhr from '../../../utils/jquery.xhr'
import {Loading, Empty} from '../../../ui/react.loading.jsx'
import Cover from '../../../ui/react.cover.jsx'

const List = React.createClass({
  render() {
    const self = this;
    const props = self.props;
    const state = self.state;
    const data = props.data;

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
                  nameImage={item.name_image}
                  name={item.name}
                  coverUrl={item.cover_url}/>
                } else {
                  return '无'
                }
              })(item)}
              </td>
              <td>
              <p>分类名：{item.name || '无'} | {item.name_en || '无'}</p>
              <p>视频：
              {((item) => {
                if (item.video_url) {
                  return <a target="_blank" href={item.video_url}>点击查看</a>
                } else {
                  return '无'
                }
              })(item)}
              </p>
              </td>
              <td>
              <a className="btn btn-default" href={`#/photo/category/${item.id}`}>编辑</a>
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
  dataUrl: '/photos/categories',
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
  setEmpty(empty) {
    this.setState({empty});
  },
  getQuery(props) {
    const query = props.location.query;
    return {
      page: query.page || 1,
      perpage: query.perpage || 20
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

    self.getData(query).done(function (ret) {

      self.setState({
        data: {
          data: ret
        }
      }, function () {
        self.setLoading(false);
      });
    })
    .always(function () {
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
        {(() => {
          if (!state.loading) {
            if (data.data.length > 0) {
              return (
                <List
                {...props}
                {...state}/>
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