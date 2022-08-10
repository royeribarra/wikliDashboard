import React, { useState, useEffect } from "react";
import { Form, Input, Select, DatePicker } from "antd";
import { TiendaService } from "../../../servicios/tiendaService";
import {
  Button,
  Card,
  CardBody,
  CardHeader
} from 'reactstrap';
import moment from 'moment';
const { Option } = Select;
const { RangePicker } = DatePicker;
const Buscar = ({form, handleParentSearch}) => 
{
  let [stores, setStores] = useState([]);

  const getStores = () => {
    const storeService = new TiendaService('stores');
    storeService.getAllSimple()
      .then(({ data }) => {
        setStores(data);
      })
  }

  const listaTiendas = stores.map((tienda) => (
    <Option value={tienda.id} key={tienda.id}>
      {tienda.business_name}
    </Option>
  ));

  useEffect(() => {
    getStores();
  }, []);

  const pasarInfo = (event) => {
    event.preventDefault();
    handleParentSearch();
  }
  return (
    <Card className="filtro-gestiones">
      <CardHeader>Buscar devolución</CardHeader>
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
                className="formulario__label"
                name="fecha"
                label="Fecha"
              >
                <RangePicker 
                  format='YYYY-MM-DD'
                />
              </Form.Item>
            </div>
            {/* <div className="col-md-6">
              <Form.Item
                className="formulario__label"
                name="producto"
                label="Producto"
              >
                <Input className="input-padre" />
              </Form.Item>
            </div> */}
          </div>
          {' '}
          <Button onClick={pasarInfo}>Buscar</Button>
        </Form>
      </CardBody>
    </Card>
  );
};

export default Buscar;