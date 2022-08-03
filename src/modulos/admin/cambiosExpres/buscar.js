import React, { useEffect, useState } from "react";
import { Form, Input, Select } from "antd";
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
      <CardHeader>Buscar cambio express</CardHeader>
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
                name="tienda_id"
                label="Nombre de la tienda"
              >
                <Select placeholder="Selecciona una tienda">
                  <Option value="" key="">
                    Ninguno
                  </Option>
                  {listaTiendas}
                </Select>
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item
                className="formulario__label"
                name="codigo"
                label="Código repo"
              >
                <Input className="input-padre" />
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