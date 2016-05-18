
import './less/index.less'

import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, useRouterHistory } from 'react-router'
import {createHashHistory} from 'history';

import routes from './routes.jsx'

window.React = React

ReactDOM.render(
  <Router
  history={useRouterHistory(createHashHistory)({queryKey: false})}
  onUpdate={() => window.scrollTo(0, 0)}
  routes={routes}/>,
  document.getElementById('J_App')
)