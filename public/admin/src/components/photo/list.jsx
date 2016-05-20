
import React from 'react'
import xhr from '../../utils/jquery.xhr'
import {Loading, Empty} from '../../ui/react.loading.jsx'
import Pagination from '../../ui/react.pagination.jsx'
import update from 'react-addons-update'
import {
  Navbar,
  Nav,
  NavItem,
} from 'react-bootstrap'

const Bar = React.createClass({
  render() {
    return (
      <Navbar>
        <Navbar.Collapse>
          <Nav pullRight>
            <NavItem href="#/photo/list/post">新增照片</NavItem>
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
              <a href={item.cover_url} target="_blank">
              <img src={item.cover_url + '?imageView2/2/w/320'} width="320"/>
              </a>
              </td>
              <td style={{
                width: '50%',
                wordBreak: 'break-all'
              }}>
              <p>照片名：{item.name || '无'}</p>
              <p>照片描述：{item.description || '无'}</p>
              <p>
              分类/套餐：
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
              &nbsp;&nbsp;
              {((item, categories) => {
                const cid = item.category_id;
                let pkgs = props.findPkgsByCid(cid);

                return(
                  <select
                  onChange={props.handlePackage}
                  data-index={i}
                  value={item.package_id}>
                    <option value="0">无套餐</option>
                    {((pkgs) => {
                      return pkgs.map(function (pkg, p) {
                        return (<option
                          key={`${pkg.id}_${p}`}
                          value={pkg.id}>
                          {pkg.name}</option>)
                      });
                    })(pkgs)}
                  </select>
                )
              })(item, categories)}

              </p>
              </td>
              <td>
              <button
              className="btn btn-danger"
              data-index={i}
              onClick={props.handleDelete}
              >删除</button>
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
  dataUrl: '/photos',
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
      perpage: query.perpage || 20
    }
  },
  getData(query) {
    return xhr.get(this.dataUrl, query)
  },
  putPhotoById(id, body) {
    return xhr.put(`/photos/${id}`, body)
  },
  deletePhotoById(id) {
    return xhr.delete(`/photos/${id}`)
  },
  findPkgsByCid(cid) {
    const categories = this.state.categories;
    let pkgs = null;
    for (let p = 0; p < categories.length; p ++) {
      let category = categories[p];
      if (cid == category.id) {
        pkgs = category.packages;
        break;
      }
    }
    return pkgs || []
  },
  handleData(props) {
    const self = this;
    const state = self.state;
    props = props || self.props;
    const query = self.getQuery(props);

    self.setLoading(true);

    $.when(
      self.getData(query),
      props.api.getPhotoCategories({
        with_pkg: 1
      }))
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

    const pkgs = self.findPkgsByCid(cid);

    const newObj = {
      category_id: cid,
      category_name: cname,
      package_id: pkgs.length ? pkgs[0].id : 0,
      package_name: pkgs.length ? pkgs[0].name : ''
    };

    const data = update(state.data, {
      data: {
        [index]: {
          $merge: newObj
        }
      }
    });

    self.putPhotoById(item.id, newObj);
    self.setState({data});
  },
  handlePackage(e) {
    const target = e.target;
    const pid = Number(target.value);

    const self = this;
    const state = self.state;

    const selectedIndex = target.selectedIndex;

    const index = target.dataset.index;
    const item = state.data.data[index];

    const pname = target[selectedIndex].innerText;

    const data = update(state.data, {
      data: {
        [index]: {
          $merge: {
            package_id: pid,
            package_name: pname
          }
        }
      }
    });

    self.putPhotoById(item.id, {
      category_id: item.category_id,
      category_name: item.category_name,
      package_id: pid,
      package_name: pname
    });

    self.setState({data});
  },
  handleDelete(e) {

    if (!confirm('确认删除')) return;

    const self = this;
    const state = self.state;

    const target = e.target;
    const index = target.dataset.index;
    const item = state.data.data[index];
    const id = item.id;

    self.deletePhotoById(id)
    .done(function (ret) {
      if (ret.status) {
        self.handleData(self.props);
      }
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
                findPkgsByCid={self.findPkgsByCid}
                handleCategory={self.handleCategory}
                handlePackage={self.handlePackage}
                handleDelete={self.handleDelete}
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