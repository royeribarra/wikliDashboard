import React, { useState, useEffect } from "react";
import { Form, Input, InputNumber, Select } from "antd";
import { TiendaService } from "../../../servicios/tiendaService";
import {
  Button,
  Card,
  CardBody,
  CardHeader
} from 'reactstrap';
const { Option } = Select;

const Buscar = ({form, handleParentSearch}) => 
{
  const tiendaService = new TiendaService("stores");
  let [tiendas, setTiendas] = useState([]);
  const getTiendas = () => {
    tiendaService.getAllSimple()
      .then(({ data }) => {
        setTiendas(data);
      })
  }

  useEffect(() => {
    getTiendas();
  }, []);

  const pasarInfo = (event) => {
    event.preventDefault();
    handleParentSearch();
  }

  const listaTiendas = tiendas.map((tienda) => (
    <Option value={tienda.id} key={tienda.id}>
      {tienda.business_name}
    </Option>
  ));

  return (
    <Card className="filtro-gestiones">
      <CardHeader>Buscar proceso</CardHeader>
      <CardBody>
        <Form
          className="formulario"
          name="nest-messages"
          form={form}
          layout="vertical"
        >
          <div className="row">
            <div className="col-md-6">
              <Form.Item
                name="fullname"
                label="Nombres y Apellidos"
              >
                <Input />
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item
                name="dni"
                label="DNI"
                
              >
                <InputNumber style={{ width: "100%"}} />
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item
                name="sede_id"
                label="Tienda"
              
              >
                <Select className="select-padre" defaultValue="Todas">
                  <Option value="" key="">
                    Ninguno
                  </Option>
                  {listaTiendas}
                </Select>
              </Form.Item>
            </div>
          </div>
          {' '}
          <Button onClick={pasarInfo}>Buscar</Button>
        </Form>
      </CardBody>
    </Card>
  );
};

export default Buscar;