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
    <Card className="filtro-gestiones">
      <CardHeader>Buscar cambio estándar</CardHeader>
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
                name="codigo"
                label="Código Repo"
              >
                <Input />
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item
                name="cliente"
                label="Cliente"
              >
                <Input />
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