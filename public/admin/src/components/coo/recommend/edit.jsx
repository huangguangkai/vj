
import React from 'react'
import Qiniu from 'react-qiniu'
import update from 'react-addons-update'

import xhr from '../../../utils/jquery.xhr'
import {Loading} from '../../../ui/react.loading.jsx'
import Cover from '../../../ui/react.cover.jsx'
import mixins from './mixins'

export default React.createClass({
  mixins: [mixins],
  dataUrl: '/recommends/home',
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
      self.getData(id))
    .done(function () {
      const token = arguments[0][0].uptoken;
      const data = arguments[1][0];

      self.setState({data, token}, function () {
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

    props.api.putHomeRecommendById(self.props.params.id, {
      title: body.title,
      title_en: body.title_en,
      title_image: body.title_image,
      cover_url: body.cover_url,
      url: body.url,
      index: body.index
    }).done(function () {
      self.setState({isSubmit: false});
      self.refs.submitBtn.innerText = 'Save';
    });
  },
  componentWillMount() {
    this.handleData(this.props.params.id);
  },
})