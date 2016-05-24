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
        <Route path="banner/create" component={components.CooBannerCreate}></Route>
        <Route path="banner/:id" component={components.CooBannerEdit}></Route>
        <Route path="recommend" component={components.CooRecommend}></Route>
        <Route path="recommend/create" component={components.CooRecommendCreate}></Route>
        <Route path="recommend/:id" component={components.CooRecommendEdit}></Route>
      </Route>
      <Route path="/photo">
        <Route path="category" component={components.PhotoCategory}></Route>
        <Route path="category/:id" component={components.PhotoCategoryEdit}></Route>
        <Route path="package" component={components.PhotoPackage}></Route>
        <Route path="package/create" component={components.PhotoPackageCreate}></Route>
        <Route path="package/:id" component={components.PhotoPackageEdit}></Route>
        <Route path="list" component={components.PhotoList}></Route>
        <Route path="list/post" component={components.PhotoPost}></Route>
      </Route>
      <Route path="/video">
        <Route path="list" component={components.VideoIndex}></Route>
        <Route path="create" component={components.VideoCreate}></Route>
        <Route path=":id" component={components.VideoEdit}></Route>
      </Route>
      <Route path="/group">
        <Route path="staff" component={components.GroupStaff}></Route>
        <Route path="staff/create" component={components.GroupStaffCreate}></Route>
        <Route path="staff/:id" component={components.GroupStaffEdit}></Route>
      </Route>
    </Route>

  </Route>

);