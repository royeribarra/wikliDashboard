import React from 'react';
import { Switch, Route, Redirect, BrowserRouter } from "react-router-dom";
import { RequireAuth, UserAuth } from './RequireAuth/RequireAuth';
import Admin from '../pages/admin/admin';
import Login from "../pages/login";
import GAListener from '../components/GAListener';
import Loader from '../components/Loader/loader';


const MainRoutes = () => {
  
  return (
    <BrowserRouter>
      
      <GAListener>
        <Switch>
          <Route path="/admin" component={(props) => {
            return (
              <RequireAuth props={{ ...props }} Component={Admin} />
            )
          }} />
          <Route exact path="/login" component={(props) => {
            return (
              <UserAuth props={{ ...props }} Component={ Login } />
              )
            }} />
          <Redirect from="/" to={`/login`} />
          <Redirect from="**" to={`/`} />
          <Redirect from="" to={`/`} />
        </Switch>
      </GAListener>
    </BrowserRouter>
  );
};

export default MainRoutes;