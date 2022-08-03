import React from 'react';
import { Switch, Route, useRouteMatch, Redirect } from "react-router-dom";
// COMPONENTES DE VISTAS
import Usuarios from "../modulos/admin/usuarios/usuarios";
import Tiendas from "../modulos/admin/tiendas/tiendas";
import CambiosEstandar from "../modulos/admin/cambiosEstandar/cambiosEstandar";
import CambiosExpres from "../modulos/admin/cambiosExpres/cambiosExpres";

import Devoluciones from "../modulos/admin/devoluciones/devoluciones";
import ProcesosFinalizados from "../modulos/admin/procesosFinalizados/procesosFinalizados";
// modulos GENERALES
import UsuarioForm from "../modulos/admin/usuarios/usuarioForm";
import TiendaForm from "../modulos/admin/tiendas/tiendaForm";
import TuRepo from "../modulos/admin/tuRepo/tuRepo";
import Distritos from "../modulos/admin/distritos/distritos";
import Facturacion from "../modulos/admin/facturacion/facturacion";
import tuRepoCuponDescuento from "../modulos/admin/tuRepoCuponDescuento/tuRepoCuponDescuento";
import cuponForm from "../modulos/admin/tuRepoCuponDescuento/cuponForm";
import MainLayout from 'components/Layout/MainLayout';
import PageSpinner from 'components/PageSpinner';
import componentQueries from 'react-component-queries';

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

            <Route exact path={`/admin/cambios-estandar`}                component = { CambiosEstandar } />
            <Route exact path={`/admin/cambios-expres`}                  component = { CambiosExpres } />
            <Route exact path={`/admin/devoluciones`}                    component = { Devoluciones } />
            <Route exact path={`/admin/procesos-finalizados`}            component = { ProcesosFinalizados } />

            <Route exact path={`/admin/usuarios`}                        component = { Usuarios } />
            <Route exact path={`/admin/usuario/crear`}                   component = { UsuarioForm } />
            <Route exact path={`/admin/usuarios/:usuarioId`}             component = { UsuarioForm } />

            <Route exact path={`/admin/facturacion`}                     component = { Facturacion } />

            <Route exact path={`/admin/tu-repo`}                         component = { TuRepo } />
            <Route exact path={`/admin/cupones`}                         component = { tuRepoCuponDescuento } />
            <Route exact path={`/admin/cupon/crear`}                     component = { cuponForm } />

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