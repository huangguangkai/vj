
import './less/index.less'

import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route } from 'react-router'

import routes from './routes.jsx'
import history from './utils/history'

window.React = React

ReactDOM.render(
  <Router
  history={history}
  onUpdate={() => window.scrollTo(0, 0)}
  routes={routes}/>,
  document.getElementById('J_App')
)