import React from 'react'
import Qiniu from 'react-qiniu'
import update from 'react-addons-update'

import xhr from '../../../utils/jquery.xhr'
import {Loading} from '../../../ui/react.loading.jsx'
import Cover from '../../../ui/react.cover.jsx'
import config from '../../../config'

export default {
  getInitialState() {
    return {
      data: {
        category_id: 0,
        category_name: '',
        name: '',
        name_en: '',
        name_image: '',
        description: '',
        description_url: '',
        cover_url: '',
        video_url: ''
      },
      categories: [],
      loading: false,
      empty: false,
      isSubmit: false,
      token: '',
    }
  },
  setLoading(loading) {
    this.setState({loading});
  },
  handleCategory(e) {
    const target = e.target;
    const cid = Number(target.value);

    const self = this;
    const state = self.state;
    const selectedIndex = target.selectedIndex;
    const cname = target[selectedIndex].innerText;

    const newObj = {
      category_id: cid,
      category_name: cname,
    };

    const data = update(state.data, {
      $merge: newObj
    });

    self.setState({data});
  },
  handleCoverDrop (files) {
    const self = this;
    const file = files[0];

    file.uploadPromise
    .then(function (ret) {
      let url = `${config.cdnPrefix}/${ret.body.key}`;
      const data = update(self.state.data, {
        $merge: {
          cover_url: url
        }
      });
      self.setState({data});
    });
  },
  handleNameImageDrop (files) {
    const self = this;
    const file = files[0];

    file.uploadPromise
    .then(function (ret) {
      let url = `${config.cdnPrefix}/${ret.body.key}`;
      const data = update(self.state.data, {
        $merge: {
          name_image: url
        }
      });
      self.setState({data});
    });
  },
  handleNameImageClean() {
    const data = update(this.state.data, {
      $merge: {
        name_image: ''
      }
    });
    this.setState({data});
  },
  handleDescDrop (files) {
    const self = this;
    const file = files[0];

    file.uploadPromise
    .then(function (ret) {
      let url = `${config.cdnPrefix}/${ret.body.key}`;
      const data = update(self.state.data, {
        $merge: {
          description_url: url
        }
      });
      self.setState({data});
    });
  },
  handleDescPicClean() {
    const data = update(this.state.data, {
      $merge: {
        description_url: ''
      }
    });
    this.setState({data});
  },
  handleVideo(e) {
    if (!this.state.data.video_url) {
      e.preventDefault()
    }
  },
  handleChange(e) {
    const self = this;
    const target = e.target;
    const name = target.name;
    const val = target.value;

    let data = update(self.state.data, {
      $merge: {
        [name]: val
      }
    });
    self.setState({data});
  },
  componentWillMount() {
    this.handleData();
  },
  verifyFields(body) {
    if (!body.cover_url) {
      alert('请上传封面图');
      return false
    }

    return true
  },
  postPackage(body) {
    return xhr.post(`/photos/packages`, body);
  },
  render() {
    const self = this;
    const state = self.state;
    const props = self.props;
    const data =state.data;

    if (data) {
      return(
        <form className="form-horizontal" onSubmit={self.handleSubmit}>
          <div className="form-group">
            <label className="col-sm-1 control-label">套餐名</label>
            <div className="col-sm-3">
              <input type="text"
              className="form-control"
              name="name"
              required
              value={data.name}
              onChange={self.handleChange}/>
            </div>
          </div>

          <div className="form-group">
            <label className="col-sm-1 control-label">套餐英文名</label>
            <div className="col-sm-3">
              <input type="text"
              className="form-control"
              name="name_en"
              required
              value={data.name_en}
              onChange={self.handleChange}/>
            </div>
          </div>

          <div className="form-group">
            <label className="col-sm-1 control-label">所属分类</label>
            <div className="col-sm-2">
              <select
              className="form-control"
              onChange={this.handleCategory}
              value={data.category_id}>
                <option value="0">无分类</option>
                {((categories) => {
                  return categories.map(function (category, c) {
                    return (<option
                      key={`${category.id}_${c}`}
                      value={category.id}>
                      {category.name}</option>)
                  });
                })(state.categories)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="col-sm-1 control-label">封面</label>
            <div className="col-sm-5">

              <Cover
              style={{
                marginBottom: '10px',
                width: '640px',
                height: '360px'
              }}
              width={640}
              height={320}
              nameImage={data.name_image}
              name={data.name}
              coverUrl={data.cover_url}/>

              <Qiniu
              style={{
                marginRight: '10px',
                display: 'inline-block',
                border: '2px dashed #ccc',
                borderRadius: '5px',
                color: '#aaa'
              }}
              multiple={false}
              onDrop={this.handleCoverDrop}
              token={state.token}>
                <div style={{
                  padding:'10px 15px'
                }}>点击上传封面图</div>
              </Qiniu>
              <Qiniu
              style={{
                marginRight: '10px',
                display: 'inline-block',
                border: '2px dashed #ccc',
                borderRadius: '5px',
                color: '#aaa'
              }}
              multiple={false}
              onDrop={this.handleNameImageDrop}
              token={state.token}>
                <div style={{
                  padding:'10px 15px'
                }}>点击上传封面文案图</div>
              </Qiniu>
              <button onClick={this.handleNameImageClean}
              type="button"
              className="btn btn-default">清除封面文案图</button>
            </div>
          </div>

          <div className="form-group">
            <label className="col-sm-1 control-label">套餐描述</label>
            <div className="col-sm-3">
              <textarea
              onChange={self.handleChange}
              className="form-control"
              name="description"
              value={data.description}
              rows="3">
              </textarea>
            </div>
          </div>

          <div className="form-group">
            <label className="col-sm-1 control-label">套餐描述图</label>
            <div className="col-sm-5">

              {((data) => {
                if (data.description_url) {
                  return (
                    <div style={{
                      marginBottom: '10px',
                      width: '640px',
                    }}>
                      <img src={`${data.description_url}?imageView2/2/w/640`}
                      width="640"/>
                    </div>
                  )
                }
              })(data)}
              <Qiniu
              style={{
                marginRight: '10px',
                display: 'inline-block',
                border: '2px dashed #ccc',
                borderRadius: '5px',
                color: '#aaa'
              }}
              multiple={false}
              onDrop={this.handleDescDrop}
              token={state.token}>
                <div style={{
                  padding:'10px 15px'
                }}>点击上传套餐描述图</div>
              </Qiniu>
              <button onClick={this.handleDescPicClean}
              type="button"
              className="btn btn-default">清除套餐描述图</button>
            </div>
          </div>

          <div className="form-group">
            <label className="col-sm-1 control-label">视频</label>
            <div className="col-sm-5">
              <div className="input-group">
                <input type="text"
                className="form-control"
                name="video_url"
                value={data.video_url}
                onChange={self.handleChange}
                placeholder="填入视频优酷地址，填入后请预览视频检查地址是否能正常访问"/>
                <a
                href={data.video_url}
                target="_blank"
                onClick={self.handleVideo}
                className="input-group-addon">预览视频</a>
              </div>
            </div>
          </div>

          <div className="form-group">
            <div className="col-sm-offset-1 col-sm-5">
              <button
              ref="submitBtn"
              disabled={state.isSubmit}
              type="submit"
              className="btn btn-primary">Save</button>
            </div>
          </div>
        </form>
      )
    } else {
      return <Loading/>
    }
  }
}