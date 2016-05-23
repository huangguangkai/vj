
import React from 'react'
import Qiniu from 'react-qiniu'
import update from 'react-addons-update'

import xhr from '../../../utils/jquery.xhr'
import {Loading} from '../../../ui/react.loading.jsx'
import Cover from '../../../ui/react.cover.jsx'
import config from '../../../config'
import mixins from './mixins'

export default React.createClass({
  mixins: [mixins],
  dataUrl: '/photos/packages',
  getData(id) {
    return xhr.get(`${this.dataUrl}/${id}`)
  },
  handleData(id) {
    const self = this;
    const props = self.props;
    const state = self.state;

    self.setLoading(true);

    $.when(
      props.api.getUptoken(),
      self.getData(id),
      props.api.getPhotoCategories())
    .done(function () {
      const token = arguments[0][0].uptoken;
      const data = arguments[1][0];
      const categories = arguments[2][0];

      self.setState({data, token, categories}, function () {
        self.setLoading(false);
      });
    });
  },
  handleSubmit(e) {
    e.preventDefault();

    const self = this;
    const props = self.props;

    self.setState({isSubmit: true});
    self.refs.submitBtn.innerText = '提交中...';

    const body = self.state.data;

    const def = [
      props.api.putPackageById(self.props.params.id, {
        category_id: body.category_id,
        category_name: body.category_name,
        name: body.name,
        name_image: body.name_image,
        description: body.description,
        description_url: body.description_url,
        cover_url: body.cover_url,
        video_url: body.video_url
      }),
      props.api.putPhotosByPid(body.id, {
        category_id: body.category_id,
        category_name: body.category_name,
      })
    ];

    $.when.apply(def).done(function () {
      self.setState({isSubmit: false});
      self.refs.submitBtn.innerText = 'Save';
    });
  },
  componentWillMount() {
    this.handleData(this.props.params.id);
  },
})