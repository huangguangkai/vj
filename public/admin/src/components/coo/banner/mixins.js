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
        title: '',
        cover_url: '',
        url: ''
      },
      loading: false,
      empty: false,
      isSubmit: false,
      token: '',
    }
  },
  setLoading(loading) {
    this.setState({loading});
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
  postBanner(body) {
    return xhr.post(`/banners`, body);
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
            <label className="col-sm-1 control-label">标题</label>
            <div className="col-sm-3">
              <input type="text"
              className="form-control"
              name="title"
              value={data.title}
              onChange={self.handleChange}/>
            </div>
          </div>

          <div className="form-group">
            <label className="col-sm-1 control-label">封面</label>
            <div className="col-sm-5">
              <div style={{
                marginBottom: '10px',
              }}>
                <img src={`${data.cover_url}?imageView2/2/w/640`} width="640"/>
              </div>

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
            </div>

          </div>

          <div className="form-group">
            <label className="col-sm-1 control-label">链接</label>
            <div className="col-sm-5">
              <input type="text"
              className="form-control"
              name="url"
              onChange={self.handleChange}
              value={data.url}
              placeholder="填入完整链接地址"/>
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