import React, { useState, useEffect } from "react";
import "./infoPedido.css";
import {
  FileExcelFilled
} from '@ant-design/icons';

import {
  Button,
  Card,
  CardBody,
  CardHeader
} from 'reactstrap';
import { AdminPedidoService } from "../../../servicios/admin/adminPedidoService";

const InfoPedido = ({data, obtenerInformacionPedidoId}) => 
{
  const adminPedidoService = new AdminPedidoService("admin/pedido");
  const pagarPedido = () => {
    adminPedidoService.pagarPedido(data.id).then(({data}) => {
      if(data.state){
        obtenerInformacionPedidoId();
      }
    });
  }

  return (
    <Card className="informacion-pedido">
      <CardHeader className="headerInformacionPedido">
        Información Pedido<p>{data.pagado ? ':  PAGADO' : ':  POR PAGAR'}</p> 
      </CardHeader>
      <CardBody>
        <div className="row">
          <div className="col-md-6">
            <p className="tituloTexto">Cliente: 
              <span className="textoInformacion">{' ' + data.cliente.nombres + ' ' + data.cliente.apellidos}</span>
            </p>
            <p className="tituloTexto">Número: 
              <span className="textoInformacion">{' ' + data.cliente.telefono}</span>
            </p>
            <p className="tituloTexto">Fecha entrega: 
              <span className="textoInformacion">{' ' + data.fecha_entrega}</span>
            </p>
          </div>
          <div className="col-md-6">
            <p className="tituloTexto">Total Productos: 
              <span className="textoInformacion">{' ' + data.totalProductos}</span>
            </p>
            <p className="tituloTexto">Delivery: 
              <span className="textoInformacion">{' ' + data.costo_delivery}</span>
            </p>
            {
              data.descuento && 
              <p className="tituloTexto">Descuento: 
                <span className="textoInformacion">{' ' + data.descuento}</span>
              </p>
            }
            
            <p className="tituloTexto">Total: 
              <span className="textoInformacion">{' ' + data.total}</span>
            </p>
          </div>
        </div>
        <p className="tituloTexto">Observación: 
          <span className="textoInformacion">{' ' + data.observacion}</span>
        </p>
        {
          data.motivoDesactivo && 
          <p className="tituloTexto">Motivo anulación: 
            <span className="textoInformacion">{' ' + data.motivoDesactivo}</span>
          </p>
        }
        
        <Button outline color="success" className="boton-descargar-pdf">
          <a href = {`${process.env.REACT_APP_BASE_PATH}/wiqli/ver-pdf/${data.id}`} target = "_blank">Descargar PDF<FileExcelFilled /></a>
        </Button>
        <Button outline color="success" className="boton-descargar-pdf" onClick={pagarPedido}>
          Pagar pedido
        </Button>
      </CardBody>
    </Card>
  );
};

export default InfoPedido;