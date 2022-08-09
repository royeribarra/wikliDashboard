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
            <div className="col-md-6">
              <Form.Item
                name="sku_producto"
                label="SKU"
              >
                <Input className="input-padre" />
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item
                tooltip="Modelo del producto"
                name="sku_description"
                label="Descripción"
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