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
const Buscar = ({form, handleParentSearch, exportExcel}) => 
{

  let [stateExcel, setStateExcel] = useState(false);
  let [fecha, setFecha] = useState({
    fechaInicial: null, fechaFinal: null
  });

  const pasarInfo = (event) => {
    event.preventDefault();
    handleParentSearch();
  }

  const verReportExcel = (changedValues, allValues) => {
    console.log(allValues)
    let newVallues = fecha;
    if(allValues.fecha){
      let fechaInicial = allValues.fecha[0].format('YYYY-MM-DD');
      let fechaFinal = allValues.fecha[1].format('YYYY-MM-DD');
      newVallues.fechaInicial =fechaInicial;
      newVallues.fechaFinal =fechaFinal;
      setFecha(newVallues);
      setStateExcel(true);
    }else{
      let fechaInicial = null;
      let fechaFinal = null;
      newVallues.fechaInicial =fechaInicial;
      newVallues.fechaFinal =fechaFinal;
      setFecha(newVallues);
      setStateExcel(false);
    }
  }

  return (
    <Card className="filtro-gestiones">
      <CardHeader>Buscar pedido</CardHeader>
      <CardBody>
        <Form
          className="formulario"
          name="nest-messages"
          form={form}
          layout="vertical"
          onValuesChange={verReportExcel}
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
          <Button onClick={pasarInfo} style={{ marginRight: "10px" }}>Buscar</Button>
          <Button color="success">
          {
            stateExcel ?  
            (<a 
              href = {`${process.env.REACT_APP_BASE_PATH}/wiqli/pedidos/exportar-excel/${fecha.fechaInicial}/${fecha.fechaFinal}`} 
              target = "_blank"
            >
              Ver Excel
            </a>) :
            <a 
              href = {`${process.env.REACT_APP_BASE_PATH}/wiqli/pedidos/exportar-excel/todos`} 
              target = "_blank"
            >
              Ver Excel
            </a>
          }
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
};

export default Buscar;