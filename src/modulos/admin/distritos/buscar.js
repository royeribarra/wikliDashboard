import React from "react";
import "antd/dist/antd.css";
import { Form, Input, Select } from "antd";
import { useEffect } from "react";
import { useState } from "react";
import { TiendaService } from "../../../servicios/tiendaService";
import { Button, Card, CardBody, CardHeader } from "reactstrap";

const { Option } = Select;

const Buscar = ({form, titulo, handleParentSearch}) => {
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
    <Card>
      <CardHeader>
        Buscar distrito
      </CardHeader>
      <CardBody>
        <Form
          className="formulario"
          name="nest-messages"
          form={form}
          layout="vertical"
        >
          <div className="row">
            <div className="form-group col-6">
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
            <div className="form-group col-6">
              <Form.Item
                className="formulario__label"
                name="codigo"
                label="Código repo"
              >
                <Input className="input-padre" />
              </Form.Item>
            </div>
            <Button onClick={pasarInfo}>Buscar</Button>
          </div>
        </Form>
      </CardBody>
    </Card>
  );
};

export default Buscar;
