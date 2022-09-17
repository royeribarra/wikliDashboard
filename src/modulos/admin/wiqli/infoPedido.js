import React, { useState, useEffect } from "react";
import { Form, Input, Select, DatePicker } from "antd";
import { TiendaService } from "../../../servicios/tiendaService";
import {
  Button,
  Card,
  CardBody,
  CardHeader
} from 'reactstrap';
const InfoPedido = ({data}) => 
{
  console.log(data);

  return (
    <Card className="filtro-gestiones">
      <CardHeader>Información Pedido</CardHeader>
      <CardBody>
        <p>Cliente: {data.cliente.nombres + ' ' + data.cliente.apellidos}</p>
        <p>Número: {data.cliente.telefono}</p>
        <p>Fecha entrega: {data.fecha_entrega}</p>
        <p>Total: {data.total}</p>
      </CardBody>
    </Card>
  );
};

export default InfoPedido;