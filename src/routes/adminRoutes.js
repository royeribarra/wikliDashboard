import React from 'react';
import { Switch, Route, useRouteMatch, Redirect } from "react-router-dom";
// COMPONENTES DE VISTAS
import Usuarios from "../modulos/admin/usuarios/usuarios";
import Tiendas from "../modulos/admin/tiendas/tiendas";
// modulos GENERALES
import UsuarioForm from "../modulos/admin/usuarios/usuarioForm";
import TiendaForm from "../modulos/admin/tiendas/tiendaForm";
import Distritos from "../modulos/admin/distritos/distritos";
import MainLayout from 'components/Layout/MainLayout';
import PageSpinner from 'components/PageSpinner';
import componentQueries from 'react-component-queries';
import pedidos from '../modulos/admin/wiqli/pedidos';
import ProductosWiqli from '../modulos/admin/producto/productos';
import ProductoForm from "../modulos/admin/producto/productoForm";
import pedidoDetalle from '../modulos/admin/wiqli/pedidoDetalle';

class AdminRoutes extends React.Component{
  render(){
    return (
      <Switch>
        <MainLayout breakpoint={this.props.breakpoint}>
          <React.Suspense fallback={<PageSpinner />}>
            <Route exact path={`/admin/tiendas`}                         component = { Tiendas } />
            <Route exact path={`/admin/tienda/crear`}                    component = { TiendaForm } />
            <Route exact path={`/admin/tiendas/:id`}                     component = { TiendaForm } />

            <Route exact path={`/admin/distritos`}                       component = { Distritos } />


            <Route exact path={`/admin/usuarios`}                        component = { Usuarios } />
            <Route exact path={`/admin/usuario/crear`}                   component = { UsuarioForm } />
            <Route exact path={`/admin/usuarios/:usuarioId`}             component = { UsuarioForm } />


            <Route exact path={`/admin/pedidos`}                         component = { pedidos } />
            <Route exact path={`/admin/pedido/:pedidoId`}                component = { pedidoDetalle } />

            <Route exact path={`/admin/productos`}                       component = { ProductosWiqli } />
            <Route exact path={"/admin/producto/crear"}                  component = { ProductoForm } />
            <Route exact path={"/admin/productos/:productoId"}           component = { ProductoForm } />
            {/* <Redirect from="/"    to={`/admin/usuarios`} />
            <Redirect from=""     to={`/admin/usuarios`} />
            <Redirect from="**"   to={`/admin/usuarios`} /> */}
          </React.Suspense>
        </MainLayout>
      </Switch>
    );
  }
};
const query = ({ width }) => {
  if (width < 575) {
    return { breakpoint: 'xs' };
  }

  if (576 < width && width < 767) {
    return { breakpoint: 'sm' };
  }

  if (768 < width && width < 991) {
    return { breakpoint: 'md' };
  }

  if (992 < width && width < 1199) {
    return { breakpoint: 'lg' };
  }

  if (width > 1200) {
    return { breakpoint: 'xl' };
  }

  return { breakpoint: 'xs' };
};

export default componentQueries(query)(AdminRoutes);