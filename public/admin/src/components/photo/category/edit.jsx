
import React from 'react'
import Qiniu from 'react-qiniu'
import update from 'react-addons-update'

import xhr from '../../../utils/jquery.xhr'
import {Loading} from '../../../ui/react.loading.jsx'
import Cover from '../../../ui/react.cover.jsx'
import config from '../../../config'

export default React.createClass({
  dataUrl: '/photos/categories',
  getInitialState() {
    return {
      data: null,
      loading: false,
      empty: false,
      isSubmit: false,
      token: '',
    }
  },
  setLoading(loading) {
    this.setState({loading});
  },
  setEmpty(empty) {
    this.setState({empty});
  },
  getData(id) {
    return xhr.get(`${this.dataUrl}/${id}`)
  },
  getUptoken(query) {
    return xhr.get('/qiniu/uptoken', query);
  },
  putCategoryById(id, body) {
    return xhr.put(`${this.dataUrl}/${id}`, body);
  },
  handleData(id) {
    const self = this;
    const state = self.state;

    self.setLoading(true);

    $.when(
      self.getUptoken(),
      self.getData(id))
    .done(function () {
      const token = arguments[0][0].uptoken;
      const data = arguments[1][0];

      self.setState({data, token}, function () {
        self.setLoading(false);
      });
    })
    .always(function () {
    });
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
        video_url: val
      }
    });
    self.setState({data});
  },
  handleSubmit(e) {
    e.preventDefault();

    const self = this;
    self.setState({
      isSubmit: true
    });
    self.refs.submitBtn.innerText = '提交中...';

    const body = self.state.data;
    self.putCategoryById(self.props.params.id, {
      name_image: body.name_image,
      cover_url: body.cover_url,
      video_url: body.video_url
    }).done(function () {
      self.setState({
        isSubmit: false
      });
      self.refs.submitBtn.innerText = 'Save';
    });
  },
  componentWillMount() {
    this.handleData(this.props.params.id);
  },
  render() {
    const self = this;
    const state = self.state;
    const data =state.data;

    if (data) {
      return(
        <form className="form-horizontal" onSubmit={self.handleSubmit}>
          <div className="form-group">
            <label className="col-sm-1 control-label">分类名</label>
            <div className="col-sm-5">
              <p className="form-control-static">{data.name || '无'} | {data.name_en || '无'}</p>
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
            <label className="col-sm-1 control-label">视频</label>
            <div className="col-sm-5">
              <div className="input-group">
                <input type="text"
                className="form-control"
                name="video_url"
                onChange={self.handleChange}
                value={data.video_url}
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
})