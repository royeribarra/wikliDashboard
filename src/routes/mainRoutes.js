import React from 'react';
import { Switch, Route, Redirect, BrowserRouter } from "react-router-dom";
import { RequireAuth, UserAuth, TiendaAuth  } from './RequireAuth/RequireAuth';
import Admin from '../pages/admin/admin';
import Tienda from '../pages/tienda/tienda';
import Login from "../pages/login";
import LoginTienda from "../pages/loginTienda";
import GAListener from '../components/GAListener';
import LoginNew from '../pages/loginNew';

const MainRoutes = () => {
  const getBasename = () => {
    return `/${process.env.PUBLIC_URL.split('/').pop()}`;
  };
  return (
    <BrowserRouter>
      <GAListener>
        <Switch>
          <Route path="/admin" component={(props) => {
            return (
              <RequireAuth props={{ ...props }} Component={Admin} />
            )
          }} />
          <Route path="/tienda" component={(props) => {
            return (
              <RequireAuth props={{ ...props }} Component={Tienda} />
            )
          }} />
          <Route exact path="/login" component={(props) => {
            return (
              <UserAuth props={{ ...props }} Component={ Login } />
              )
            }} />
          <Route exact path="/login-tienda" component={(props) => {
            return (
              <TiendaAuth props={{ ...props }} Component={ LoginTienda } />
              )
            }} />
          {/* <Route exact path="/royer" component={(props) => {
            return (
              <TiendaAuth props={{ ...props }} Component={ LoginNew } />
              )
          }} /> */}
          <Redirect from="/" to={`/login-tienda`} />
          <Redirect from="**" to={`/`} />
          <Redirect from="" to={`/`} />
        </Switch>
      </GAListener>
    </BrowserRouter>
  );
};

export default MainRoutes;