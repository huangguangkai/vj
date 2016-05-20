
import React from 'react'
import xhr from '../utils/jquery.xhr'
import {Loading, Empty} from '../ui/react.loading.jsx'
import Pagination from '../ui/react.pagination.jsx'

export default {
  dataUrl: '',
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

    self.getData(query)
    .done(function (data) {
      self.setState({data}, function () {
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
                <div>
                {`content`}
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
}