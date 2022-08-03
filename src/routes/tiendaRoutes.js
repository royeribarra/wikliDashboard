import React from 'react';
import { Switch, Route } from "react-router-dom";
// COMPONENTES DE VISTAS
import Cambios from "../modulos/adminTienda/cambios/cambios";
import CambiosExpres from "../modulos/adminTienda/cambiosExpres/cambiosExpres";


import Productos from "../modulos/adminTienda/productos/productos";
import ProcesosFinalizados from "../modulos/adminTienda/procesos-finalizados/procesos-finalizados";
import Estadisticas from "../modulos/adminTienda/estadisticas/estadisticas";
import Ventas from "../modulos/adminTienda/ventas/ventas";
// modulos GENERALES
import ProductoForm from "../modulos/adminTienda/productos/productoForm";
import configuracion from "../modulos/adminTienda/configuracion/configuracion";
import Perfil from "../modulos/adminTienda/perfil/perfil";
import MainLayoutTienda from '../components/Layout/MainLayoutTienda';
import PageSpinner from 'components/PageSpinner';
import componentQueries from 'react-component-queries';
const Devoluciones = React.lazy(() => import('../modulos/adminTienda/devoluciones/devoluciones'));

class TiendaRoutes extends React.Component{
  render(){
    return (
      <Switch>
        <MainLayoutTienda breakpoint={this.props.breakpoint}>
          <React.Suspense fallback={<PageSpinner />}>
            <Route exact path={`/tienda/productos`}                 component = { Productos } />
            <Route exact path={"/tienda/producto/crear"}                  component = { ProductoForm } />
            <Route exact path={"/tienda/productos/:productoId"}           component = { ProductoForm } />

            <Route exact path={`/tienda/cambios-estandar`}          component = { Cambios } />
            <Route exact path={`/tienda/cambios-expres`}            component = { CambiosExpres } />
            <Route exact path={`/tienda/devoluciones`}              component = { Devoluciones } />
            <Route exact path={`/tienda/procesos-finalizados`}      component = { ProcesosFinalizados } />
            <Route exact path={`/tienda/estadisticas`}              component = { Estadisticas } />
            <Route exact path={`/tienda/ventas`}                    component = { Ventas } />
            <Route exact path={`/tienda/configuracion`}             component = { configuracion } />
            <Route exact path={`/tienda/perfil`}                    component = { Perfil } />
          </React.Suspense>
        </MainLayoutTienda>
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

export default componentQueries(query)(TiendaRoutes);