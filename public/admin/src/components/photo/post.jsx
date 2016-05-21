
import React from 'react'
import Qiniu from 'react-qiniu'
import update from 'react-addons-update'
import Promise from 'bluebird'
import xhr from '../../utils/jquery.xhr'

export default React.createClass({
  getInitialState() {
    return {
      files: [],
      token: '',
    }
  },
  handleUpload: function (files) {
    // set onprogress function before uploading
    files.map(function (f) {
      f.onprogress = function(e) {
        console.log(e.percent);
      };
    });
  },

  handleDrop: function (files) {

    const self = this;

    const _files = update(this.state.files, {
      $push: files
    });

    this.setState({
        files: _files
    });
    // files is a FileList(https://developer.mozilla.org/en/docs/Web/API/FileList) Object
    // and with each file, we attached two functions to handle upload progress and result
    // file.request => return super-agent uploading file request
    // file.uploadPromise => return a Promise to handle uploading status(what you can do when upload failed)
    // `react-qiniu` using bluebird, check bluebird API https://github.com/petkaantonov/bluebird/blob/master/API.md
    // see more example in example/app.js
    console.log('Received files: ', files);

    const def = [];

    files.map(function (file) {
      def.push(file.uploadPromise);
    });

    Promise.all(def)
    .then(function (ret) {

      const photos = ret.map(function (file) {
        return {
          key: file.body.key
        }
      });
      self.postPhoto(photos);
    })
  },
  postPhoto(photos) {
    return xhr.post('/photos', {
      photos: photos
    });
  },
  getUptoken(query) {
    return xhr.get('/qiniu/uptoken', query);
  },
  componentWillMount() {
    const self = this;
    this.getUptoken()
    .done(function (ret) {
      self.setState({
        token: ret.uptoken
      });
    })
  },
  render() {
    const self = this;
    const state = self.state;
    const files = state.files;

    return (
      <form>
        <div className="form-group">
          <label>上传</label>
          <Qiniu
          style={{
            width: '300px',
            height: '200px',
            border: '2px dashed #ccc',
            borderRadius: '5px',
            color: '#aaa'
          }}
          onDrop={this.handleDrop}
          token={this.state.token}
          onUpload={this.handleUpload}>
            <div style={{
              padding:'30px'
            }}>Try dropping some files here, or click to select files to upload.</div>
          </Qiniu>
        </div>

        <div className="form-group">
          <label>已上传</label>
          <div className="clearfix">
          {((files) => {

            if (files.length === 0) {
              return '还未上传照片'
            }

            return files.map(function (file) {
              return (
                <div style={{
                  display: 'inline-block',
                  width: '320',
                  margin: '0 10px 10px 0'
                }}>
                  <img src={`${file.preview}`} width="320"/>
                </div>
              )
            })

          })(files)}
          </div>
        </div>
      </form>
    )
  }
})