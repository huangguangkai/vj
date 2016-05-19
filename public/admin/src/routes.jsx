import React from 'react'
import { IndexRoute,Route,Redirect } from 'react-router'

import * as components from './components';

export default (

  <Route path="/" component={components.Main}>
    <IndexRoute component={components.Admin}/>

    <Route path="login" component={components.Login} />

    <Redirect from="admin" to="dashboard" />
    <Route path="admin" component={components.Admin}>

      <Route path="/dashboard" component={components.Dashboard}></Route>

      <Route path="/coo">
        <Route path="banner" component={components.CooBanner}></Route>
        <Route path="recommend" component={components.CooRecommend}></Route>
      </Route>
      <Route path="/photo">
        <Route path="category" component={components.PhotoCategory}></Route>
        <Route path="package" component={components.PhotoPackage}></Route>
        <Route path="list" component={components.PhotoList}></Route>
      </Route>
      <Route path="/video">
        <Route path="wedding" component={components.VideoWedding}></Route>
      </Route>
      <Route path="/group">
        <Route path="photographer" component={components.GroupPhotographer}></Route>
      </Route>
    </Route>

  </Route>

);