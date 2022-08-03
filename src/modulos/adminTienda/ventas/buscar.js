import React from "react";
import { Form, Input } from "antd";
import {
  Button,
  Card,
  CardBody,
  CardHeader
} from 'reactstrap';

const Buscar = ({form, handleParentSearch}) => 
{
  const pasarInfo = (event) => {
    event.preventDefault();
    handleParentSearch();
  }
  return (
    <Card className="filtro-producto" style={{ marginBottom: "15px" }}>
      <CardHeader>Buscar producto</CardHeader>
      <CardBody>
        <Form
          className="formulario"
          name="nest-messages"
          form={form}
          layout="vertical"
        >
          <div className="row">
            <div className="col-md-4">
              <Form.Item
                className="formulario__label"
                name="codigo_compra"
                label="Codigo de compra"
              >
                <Input className="input-padre" />
              </Form.Item>
            </div>
            <div className="col-md-4">
              <Form.Item
                className="formulario__label"
                name="sku"
                label="SKU"
              >
                <Input className="input-padre" />
              </Form.Item>
            </div>
            <div className="col-md-4">
              <Form.Item
                className="formulario__label"
                name="nombre_cliente"
                label="Nombre cliente"
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