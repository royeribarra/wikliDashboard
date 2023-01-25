import React from "react";
import { Form, DatePicker } from "antd";
import {
  Button,
  Card,
  CardBody,
  CardHeader
} from 'reactstrap';
import moment from 'moment';

const { RangePicker } = DatePicker;

const Buscar = ({form, handleParentSearch}) => 
{
  const pasarInfo = (event) => {
    event.preventDefault();
    handleParentSearch();
  }

  return (
    <Card className="filtro-producto" style={{ marginBottom: "15px" }}>
      <CardHeader>Seleccionar semana</CardHeader>
      <CardBody>
        <Form
          className="formulario"
          name="nest-messages"
          form={form}
          layout="vertical"
          initialValues={{
            'week': [moment(), moment().add(-7, 'd')]
          }}
        >
          <div className="row">
            <div className="col-md-6">
              <Form.Item
                name="week"
                label="Semana"
                rules= {[ {type: 'array', required: true, message: 'Please select time!'} ]}
              >
                <RangePicker defaultValue={[moment(), moment().add(-7, 'd')]} />
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