import React from "react";
import "antd/dist/antd.css";
import { Form, Input, InputNumber } from "antd";
import { Card, CardBody, CardHeader, Button } from "reactstrap";

const Buscar = ({form, handleParentSearch}) => {
  const pasarInfo = (event) => {
    event.preventDefault();
    handleParentSearch();
  }
  return (
    <Card style={{ marginBottom: "15px" }}>
      <CardHeader>
        Buscar tienda
      </CardHeader>
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
                name="name"
                label="Nombre de la tienda"
              >
                <Input  />
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item
                name="ruc"
                label="RUC"
              >
                <InputNumber style={{ width: "100% "}} />
              </Form.Item>
            </div>
          </div>
          <Button onClick={pasarInfo}>Buscar</Button>
        </Form>
      </CardBody>
    </Card>
  );
};

export default Buscar;