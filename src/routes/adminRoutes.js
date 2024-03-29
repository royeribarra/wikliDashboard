import React from 'react';
import { Switch, Route } from "react-router-dom";
// COMPONENTES DE VISTAS
import Usuarios from "../modulos/admin/usuarios/usuarios";
// modulos GENERALES
import UsuarioForm from "../modulos/admin/usuarios/usuarioForm";
import MainLayout from '../components/Layout/MainLayout';
import PageSpinner from '../components/PageSpinner';
import pedidos from '../modulos/admin/wiqli/pedidos';
import ProductosWiqli from '../modulos/admin/producto/productos';
import ProductoForm from "../modulos/admin/producto/productoForm";
import pedidoDetalle from '../modulos/admin/wiqli/pedidoDetalle';
import pedidosIncorrectos from '../modulos/admin/wiqli/pedidosIncorrectos';
import productoExterno from '../modulos/admin/productoExterno/productoExterno';
import productoExternoForm from '../modulos/admin/productoExterno/productoExternoForm';
import configuracion from '../modulos/admin/configuracion/configuracion';
import estadisticaProducto from '../modulos/admin/productoExterno/estadisticaProducto';
import cuponDescuento from '../modulos/admin/cuponDescuento/cuponDescuento';
import cuponForm from '../modulos/admin/cuponDescuento/cuponForm';
import precioComparativo from '../modulos/admin/precioComparativo/precioComparativo';
import { Spin } from 'antd';
import { useSelector } from "react-redux";

function AdminRoutes(){
  const state = useSelector((state) => state);
  const { show } = state.loader;
  return (
    <Switch>
      <Spin tip="Espere por favor..." spinning={show}>
      <MainLayout>
          <Route exact path={`/admin/configuracion`}                   component = { configuracion } />

          <Route exact path={`/admin/usuarios`}                        component = { Usuarios } />
          <Route exact path={`/admin/usuario/crear`}                   component = { UsuarioForm } />
          <Route exact path={`/admin/usuarios/:usuarioId`}             component = { UsuarioForm } />

          <Route exact path={`/admin/pedidos-activos`}                 component = { pedidos } />
          <Route exact path={`/admin/pedidos-incorrectos`}             component = { pedidosIncorrectos } />
          <Route exact path={`/admin/pedido/:pedidoId`}                component = { pedidoDetalle } />

          <Route exact path={`/admin/productos`}                       component = { ProductosWiqli } />
          <Route exact path={"/admin/producto/crear"}                  component = { ProductoForm } />
          <Route exact path={"/admin/productos/:productoId"}           component = { ProductoForm } />

          <Route exact path={"/admin/precios-externos"}                component = { ProductoForm } />
          <Route exact path={"/admin/precio-externo/:productoId"}      component = { ProductoForm } />

          <Route exact path={"/admin/scraping/productos-externos"}      component = { productoExterno } />
          <Route exact path={"/admin/scraping/productos-externos/crear"}      component = { productoExternoForm } />
          <Route exact path={"/admin/scraping/producto-externo/:productoId"}      component = { productoExternoForm } />
          <Route exact path={"/admin/scraping/producto-externo/estadistica/:productoId"}      component = { estadisticaProducto } />

          <Route exact path={"/admin/cupones-descuento"}                component = { cuponDescuento } />
          <Route exact path={`/admin/cupones-descuento/crear`}          component = { cuponForm } />
          <Route exact path={"/admin/cupon-descuento/:cuponId"}         component = { cuponForm } />

          <Route exact path={"/admin/comparacion-precios"}              component = { precioComparativo } />
        
      </MainLayout>
      </Spin>
    </Switch>
  );
};

export default AdminRoutes;