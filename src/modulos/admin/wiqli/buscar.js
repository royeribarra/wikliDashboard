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
import { asignarUrlDescarga } from "../../../redux/actions/pedidoActions";
import { useDispatch, useSelector } from "react-redux";
const { Option } = Select;
const { RangePicker } = DatePicker;
const Buscar = ({form, handleParentSearch, selectedRowsKeys=[], clearSeleccionados, clearForm }) => 
{
  console.log(selectedRowsKeys)
  const state = useSelector((state) => state);
  const { urlDescarga } = state.pedido;
  const dispatch = useDispatch();
  let [tipoDescarga, setTipoDescarga] = useState(1);
  //let [urlDescarga, setUrlDescarga] = useState(`${process.env.REACT_APP_BASE_PATH}/wiqli/pedidos/exportar-excel/todos`);
  let [stateExcel, setStateExcel] = useState(false);
  let [arrayPedidosSeleccionados, setArrayPedidosSeleccionados] = useState([]);
  let [fecha, setFecha] = useState({
    fechaInicial: null, fechaFinal: null
  });

  const pasarInfo = (event) => {
    event.preventDefault();
    handleParentSearch();
  }

  const verReportExcel = (changedValues, allValues) => {
    if(allValues.fecha){
      // let fechaInicial = allValues.fecha[0].format('YYYY-MM-DD');
      // let fechaFinal = allValues.fecha[1].format('YYYY-MM-DD');
      // newVallues.fechaInicial =fechaInicial;
      // newVallues.fechaFinal =fechaFinal;
      // setFecha(newVallues);
      setFecha({
        ...fecha,
        fechaInicial: allValues.fecha[0].format('YYYY-MM-DD'),
        fechaFinal: allValues.fecha[1].format('YYYY-MM-DD')
      });
      clearSeleccionados();
      console.log(1)
      dispatch(asignarUrlDescarga({tipo: 2, fechaInicial: allValues.fecha[0].format('YYYY-MM-DD'), fechaFinal: allValues.fecha[1].format('YYYY-MM-DD')}));
      //setUrlDescarga(`${process.env.REACT_APP_BASE_PATH}/wiqli/pedidos/exportar-excel/${allValues.fecha[0].format('YYYY-MM-DD')}/${allValues.fecha[1].format('YYYY-MM-DD')}`);
    }else{
      // let fechaInicial = null;
      // let fechaFinal = null;
      // newVallues.fechaInicial =fechaInicial;
      // newVallues.fechaFinal =fechaFinal;
      // setFecha(newVallues);
      // setStateExcel(false);
      console.log(2)
      dispatch(asignarUrlDescarga({tipo: 1}));
      //setUrlDescarga(`${process.env.REACT_APP_BASE_PATH}/wiqli/pedidos/exportar-excel/todos`);
    }
  }

  // useEffect(()=>{
  //   let array = "";
  //   if(selectedRowsKeys.length > 0)
  //   {
  //     selectedRowsKeys.forEach((row)=>{
  //       array = array+`pedidos[]=${row}&`
  //     });
  //     clearForm();
  //     setUrlDescarga(`${process.env.REACT_APP_BASE_PATH}/wiqli/pedidos/exportar-excel?${array}`);
  //   }
  // }, [selectedRowsKeys]);

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
                  format='DD-MM-YYYY'
                  placeholder={['Inicio', 'Fin']}
                />
              </Form.Item>
            </div>
          </div>
          {' '}
          <Button onClick={pasarInfo} style={{ marginRight: "10px" }}>Buscar</Button>
          {/* <Button color="success" style={{ marginRight: "10px" }}>
          {
            stateExcel ?  
            (<a 
              href = {`${process.env.REACT_APP_BASE_PATH}/wiqli/pedidos/exportar-excel/${fecha.fechaInicial}/${fecha.fechaFinal}`} 
              target = "_blank"
            >
              Descargar Excel
            </a>) :
            <a 
              href = {`${process.env.REACT_APP_BASE_PATH}/wiqli/pedidos/exportar-excel/todos`} 
              target = "_blank"
            >
              Descargar Excel
            </a>
          }
          </Button> */}
          <Button color="info">
            <a 
              style={{ color: "white"}}
              href = {urlDescarga} 
              target = "_blank"
            >
              Descargar Excel
            </a>
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
};

export default Buscar;