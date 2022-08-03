import React from "react";
import "antd/dist/antd.css";
import { Form, Select, Button, DatePicker } from "antd";
import { useEffect } from "react";
import { useState } from "react";
import { TiendaService } from "../../../servicios/tiendaService";
import moment from 'moment';

import {
  Card,
  CardBody,
  CardHeader
} from 'reactstrap';
const { RangePicker } = DatePicker;
const { Option } = Select;

const Buscar = ({form, titulo, handleParentSearch, getFeesTienda}) => {
  const tiendaService = new TiendaService("stores");
  let [tiendas, setTiendas] = useState([]);
  let [tiendaSeleccionada, setTiendaSeleccionada] = useState();
  let [roles, setRoles] = useState([]);
  let [fechaInicial, setFechaInicial] = useState();
  let [fechaFinal, setFechaFinal] = useState();
  let [id, setId] = useState();

  const getTiendas = () => {
    tiendaService.getAllSimple()
      .then(({ data }) => {
        setTiendas(data);
      })
  }

  useEffect(() => {
    getTiendas();
  }, []);

  const onChange = (val) => {
    const values1 = form.getFieldsValue();
    const rangeValue = values1['fecha'];
    setFechaInicial(rangeValue[0].format('YYYY-MM-DD'));
    setFechaFinal(rangeValue[1].format('YYYY-MM-DD'));
    setTiendaSeleccionada(val);
  }

  const onChangeTipoReporte = () => {
    
  }

  const onFinish = (values) =>{
  }

  const pasarDatosSearch = () => {
    handleParentSearch();
    getFeesTienda(fechaInicial, fechaFinal, tiendaSeleccionada);
  }

  return (
    <Card style={{ marginBottom: "15px" }}>
      <CardHeader>
        Filtrar
      </CardHeader>
      <CardBody>
        <Form
          name="basic"
          form={form}
          initialValues={{
            'fecha': [moment(), moment().add(7, 'd')]
          }}
          layout="vertical"
        >
          <div className="row">
            <div className="col-md-6">
              <Form.Item
                label="Pedidos"
                name="fecha"
                rules= {[ {type: 'array', required: true, message: 'Please select time!'} ]}
              >
                <RangePicker 
                  format='YYYY-MM-DD' 
                  defaultValue={[moment(), moment().add(7, 'd')]}
                  style={{width: "100%"}}
                />
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item
                label="Tipo de Reporte"
                name="tipo_reporte"
              >
                <Select defaultValue="mes" style={{ width: "100%" }} onChange={onChangeTipoReporte}>
                  <Option value="mes">Último mes</Option>
                  <Option value="semana">Última semana</Option>
                  <Option value="anio">Último año</Option>
                </Select>
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item
                label="Tienda"
                name="tienda"
              >
                <Select defaultValue="" style={{ width: "100%" }} onChange={onChange}>
                  <Option value="" key="none">Ninguno</Option>
                  { tiendas && tiendas.map( tienda => (
                      <Option value={tienda.id} key={tienda.id}> {tienda.business_name}</Option>
                    ))
                  }
                </Select>
              </Form.Item>
            </div>
          </div>
          
          <Form.Item>
            <Button type="primary" onClick={pasarDatosSearch}>
              Buscar
            </Button>
          </Form.Item>
          {
            tiendaSeleccionada && 
            <Button type="primary">
              <a href = {`${process.env.REACT_APP_BASE_PATH}/ver-pdf/${tiendaSeleccionada}/${fechaInicial}/${fechaFinal}`} target = "_blank">Ver PDF</a>
            </Button>
          }
        </Form>
      </CardBody>
    </Card>
  );
};

export default Buscar;
