
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
  handleData() {
    const self = this;
    const props = self.props;
    const state = self.state;

    self.setLoading(true);

    $.when(
      props.api.getUptoken(),
      props.api.getPhotoCategories())
    .done(function () {
      const token = arguments[0][0].uptoken;
      const categories = arguments[1][0];

      self.setState({token, categories}, function () {
        self.setLoading(false);
      });
    });
  },
  handleSubmit(e) {
    e.preventDefault();

    const self = this;
    const props = self.props;
    const state = self.state;
    const body = state.data;

    if (this.verifyFields(body)) {

      self.setState({
        isSubmit: true
      });
      self.refs.submitBtn.innerText = '提交中...';

      self.postPackage(body)
      .done(function () {
        self.refs.submitBtn.innerText = '提交成功';
      });
    }
  },
})