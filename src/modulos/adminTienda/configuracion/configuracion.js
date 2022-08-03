import React, { useEffect, useState } from "react";
import { useRouteMatch, NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { Form, Input, Switch, Checkbox, Row, Col, Button } from "antd";
import { ConfiguracionService } from "../../../servicios/tienda/configuracionService";
import { updateMigas } from "../../../redux/actions/routeActions";
import { toastr } from "react-redux-toastr";
import Page from '../../../components/Page';

import {
  Card,
  CardBody,
  CardHeader,
  Table
} from 'reactstrap';

const MotivoComponente = ({data, actualizarPagoLogistico, actualizarMotivo}) => {
  const [pago, setPago] =useState(data.pago_logistico);
  const [motivoInterno, setMotivoInterno] = useState();
  const onChange = (e) => {
    setPago(e.target.value)
    actualizarPagoLogistico(data.id, e.target.value, e.target.checked)
  }

  const onChangeSwitch = (checked) => {
    actualizarMotivo(data.id, checked)
  }

  return(
    <div style={{ display: "flex", justifyContent: "space-between"}}>
      <div style={{ display: "flex"}}>
        <Switch onChange={onChangeSwitch} defaultChecked={data.activo} />
        <p>{data.motivo.nombre}</p>
      </div>
      <div>
        <Checkbox 
          value={1} 
          onChange={onChange} 
          defaultChecked={data.pago_logistico === 1 ? true: false} 
          checked={ pago === 1 ? true : false } 
        >Cliente
        </Checkbox>
      </div>
      <div>
        <Checkbox 
          value={2} 
          onChange={onChange} 
          defaultChecked={data.pago_logistico === 2 ? true: false} 
          checked={ pago === 2 ? true : false }
          >Tienda
        </Checkbox>
      </div>
    </div>
  );
}

const MotivosComponente = ({data, actualizarPagoLogistico, actualizarMotivo}) => {
  const [pago, setPago] =useState(data.pago_logistico);
  const [motivoInterno, setMotivoInterno] = useState();
  const onChange = (e) => {
    setPago(e.target.value)
    actualizarPagoLogistico(data.id, e.target.value, e.target.checked)
  }

  const onChangeSwitch = (checked) => {
    actualizarMotivo(data.id, checked)
  }

  return(
    <div className="row">
      <div className="col-md-6" style={{ display: "flex" }}>
        <Switch onChange={onChangeSwitch} defaultChecked={data.activo} />
        <p>{data.motivo.nombre}</p>
      </div>
      <div className="col-md-3" style={{ display: "flex", justifyContent: "end" }}>
        <Checkbox 
          value={1} 
          onChange={onChange} 
          defaultChecked={data.pago_logistico === 1 ? true: false} 
          checked={ pago === 1 ? true : false } 
        >Cliente
        </Checkbox>
      </div>
      <div className="col-md-3" style={{ display: "flex", justifyContent: "end" }}>
        <Checkbox 
          value={2} 
          onChange={onChange} 
          defaultChecked={data.pago_logistico === 2 ? true: false} 
          checked={ pago === 2 ? true : false }
          >Tienda
        </Checkbox>
      </div>
    </div>
  );
}

const MotivosComponenteTable = ({data, actualizarPagoLogistico, actualizarMotivo}) => {
  const [pago, setPago] =useState(data.pago_logistico);
  const [motivoInterno, setMotivoInterno] = useState();
  const onChange = (e) => {
    setPago(e.target.value)
    actualizarPagoLogistico(data.id, e.target.value, e.target.checked)
  }

  const onChangeSwitch = (checked) => {
    actualizarMotivo(data.id, checked)
  }

  return(
    <tr>
      <td>
        <Switch onChange={onChangeSwitch} defaultChecked={data.activo} />
        <p>{data.motivo.nombre}</p>
      </td>
      <td>
        <Checkbox 
          value={1} 
          onChange={onChange} 
          defaultChecked={data.pago_logistico === 1 ? true: false} 
          checked={ pago === 1 ? true : false } 
        >Cliente
        </Checkbox>
      </td>
      <td>
        <Checkbox 
          value={2} 
          onChange={onChange} 
          defaultChecked={data.pago_logistico === 2 ? true: false} 
          checked={ pago === 2 ? true : false }
          >Tienda
        </Checkbox>
      </td>
    </tr>
  );
}

const Configuracion = ({ updateMigas }) => {
  const configuracionService = new ConfiguracionService("configuracion");
  const { url, path } = useRouteMatch();
  const [form] = Form.useForm();
  const [id, setId] = useState();
  const [motivos, setMotivos] = useState([]);
  const [motivosTienda, setMotivosTienda] = useState([]);

  const onFinish = (values) => {
    let newValues = values;
    newValues.motivosTienda = motivosTienda
    if(id){
      configuracionService.update(id, newValues).then(({data}) => {
        toastr.info(data.message)
      });
    }else{
      configuracionService.store(newValues).then(({data}) => {
        toastr.info(data.message)
      });
    }
  }

  const getConfiguracionInfo = () => {
    configuracionService.get().then(({ data }) => {
      let atencion = data.dias_atencion;
      let lunes = data.dias_atencion.lunes ? 'A' : '',
      martes = data.dias_atencion.martes ? 'B' : '',
      miercoles = data.dias_atencion.miercoles ? 'C' : '',
      jueves = data.dias_atencion.jueves ? 'D' : '',
      viernes = data.dias_atencion.viernes ? 'E' : '',
      sabado = data.dias_atencion.sabado ? 'F' : '',
      domingo = data.dias_atencion.domingo ? 'G' : '';
      form.setFieldsValue({
        devolucion: data.devolucion,
        estandar: data.estandar,
        deluxe: data.deluxe,
        servicio_tecnico: data.servicio_tecnico,
        plazo: data.plazo,
        compra_no_web: data.compra_no_web,
        requiere_boleta: data.requiere_boleta,
        dias_atencion: [lunes, martes, miercoles, jueves, viernes, sabado, domingo],
      });
      if(data){
        setId(data.id);
        setMotivosTienda(data.tienda_motivo_devolucion)
      }
    });
  };

  const getMotivos = () => {
    configuracionService.getMotivos().then(({data}) => {
      setMotivos(data)
    })
  }

  useEffect(() => {
    updateMigas(url);
    getConfiguracionInfo();
    getMotivos();
  }, []);

  const ActualizarMotivo = (id, checked) => {
    let newMotivo = [...motivosTienda];
    let index = newMotivo.findIndex((element) => element.id === id);
    newMotivo[index].activo = checked;
    setMotivosTienda(newMotivo);
  }

  const ActualizarPagoLogistico = (id, tipo, checked) => {
    let newMotivo = [...motivosTienda];
    let index = newMotivo.findIndex((element) => element.id === id);
    newMotivo[index].pago_logistico = tipo;
    setMotivosTienda(newMotivo);
  }

  // const MotivosTienda = motivosTienda.map((motivo) =>
  //   <MotivosComponente 
  //     data={motivo} 
  //     key={motivo.id} 
  //     actualizarMotivo={ActualizarMotivo}
  //     actualizarPagoLogistico={ActualizarPagoLogistico}
  //   />
  // );

  const MotivosTiendaTable = motivosTienda.map((motivo) =>
    <MotivosComponenteTable
      data={motivo} 
      key={motivo.id} 
      actualizarMotivo={ActualizarMotivo}
      actualizarPagoLogistico={ActualizarPagoLogistico}
    />
  );

  return (
    <Page title="Configuración">
      <Card>
        <CardBody>
          <Form
            className="formulario"
            name="nest-messages"
            form={form}
            onFinish={onFinish}
            layout="vertical"
            initialValues={{ 
              devolucion: false,
              estandar: false,
              deluxe: false,
              servicio_tecnico: false,
              plazo: 60,
              compra_no_web: false,
              requiere_boleta: false,
              dias_atencion: []
            }}
          >
            <div>
              <CardHeader>
                Tipos de servicios aceptados
              </CardHeader>
              <CardBody>
                <div className="row">
                  <div className="col-md-4">
                    <Form.Item
                        className="formulario__label"
                        name={"devolucion"}
                        label="Devoluciones"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>
                  </div>
                  <div className="col-md-4">
                    <Form.Item
                        className="formulario__label"
                        name={"estandar"}
                        label="Cambios Estándar"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>
                  </div>
                  <div className="col-md-4">
                    <Form.Item
                        className="formulario__label"
                        name={"deluxe"}
                        label="Cambios Express"
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>
                  </div>
                  <div className="col-md-4">
                    <Form.Item
                      className="formulario__label"
                      name={"servicio_tecnico"}
                      label="Servicio técnico"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                  </div>
                  <div className="col-md-4">
                    <Form.Item
                      tooltip="Opción que permite al usuario generar un procedimiento en caso la compra fue realizada por otro medio que no fuera web."
                      className="formulario__label"
                      name={"compra_no_web"}
                      label="Compra fuera de web"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                  </div>
                </div>
              </CardBody>
            </div>
            <div>
              <CardHeader>
                Plazos
              </CardHeader>
              <CardBody>
                <Form.Item
                  tooltip="Plazo para cambiar o devolver un producto desde la fecha de compra."
                  name={"plazo"}
                  label="Plazo (Días)"
                  rules={[{ required: true }]}
                >
                  <Input style={{ width: "auto" }} />
                </Form.Item>
              </CardBody>
            </div>
            <div>
              <CardHeader>
                Días de atención 
              </CardHeader>
              <CardBody>
                <Form.Item 
                  name="dias_atencion" 
                  label="Días de atención">
                  <Checkbox.Group>
                    <Row>
                      <Col span={16}>
                        <Checkbox value="A" style={{ lineHeight: '32px' }} checked="checked">
                          Lunes
                        </Checkbox>
                      </Col>
                      <Col span={16}>
                        <Checkbox value="B" style={{ lineHeight: '32px' }}>
                          Martes
                        </Checkbox>
                      </Col>
                      <Col span={16}>
                        <Checkbox value="C" style={{ lineHeight: '32px' }}>
                          Miércoles
                        </Checkbox>
                      </Col>
                      <Col span={16}>
                        <Checkbox value="D" style={{ lineHeight: '32px' }}>
                          Jueves
                        </Checkbox>
                      </Col>
                      <Col span={16}>
                        <Checkbox value="E" style={{ lineHeight: '32px' }}>
                          Viernes
                        </Checkbox>
                      </Col>
                      <Col span={16}>
                        <Checkbox value="F" style={{ lineHeight: '32px' }}>
                          Sábado
                        </Checkbox>
                      </Col>
                      <Col span={16}>
                        <Checkbox value="G" style={{ lineHeight: '32px' }}>
                          Domingo
                        </Checkbox>
                      </Col>
                    </Row>
                  </Checkbox.Group>
                </Form.Item>
              </CardBody>
            </div>
            <div>
              <CardHeader>
                Repo Retail
              </CardHeader>
              <CardBody>
                <Form.Item
                  className="formulario__label"
                  name={"requiere_boleta"}
                  label="Requiere boleta"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </CardBody>
            </div>
            <div>
              <CardHeader>Motivos a mostrar</CardHeader>
              <CardBody>
                <Form.Item
                  name={"royer"}
                >
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Motivos</th>
                        <th colSpan="2">Pago Logístico</th>
                      </tr>
                    </thead>
                  
                  
                    <tbody>
                      {(motivosTienda.length>0) && 
                        MotivosTiendaTable
                      }
                    </tbody>
                  </Table>
                </Form.Item>
              </CardBody>
              {/* <div>
                <div style={{ display: "flex", justifyContent: "space-between"}}>
                  <div><h6>Pago logístico</h6></div>
                </div>
                <Form.Item
                  className="formulario__label"
                  name={"royer"}
                  label="Motivos"
                >
                  {(!motivosTienda.length>0) && motivos.map((motivo) => (
                    <div style={{ display: "flex", justifyContent: "space-between"}}>
                      <div style={{ display: "flex"}}>
                        <Switch />
                        <p>{motivo.nombre}</p>
                      </div>
                      <div>
                        <Checkbox 
                          value={1}
                        >Cliente
                        </Checkbox>
                      </div>
                      <div>
                        <Checkbox 
                          value={2}
                          >Tienda
                        </Checkbox>
                      </div>
                    </div>
                  ))}
                  {(motivosTienda.length>0) && 
                    MotivosTienda
                  }
                </Form.Item>
              </div> */}
            </div>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ margin: "10px" }}>
                Guardar
              </Button>
              <NavLink to="/tienda/productos">
                <Button type="danger" style={{ margin: "10px" }}>Cancelar</Button>
              </NavLink>
            </Form.Item>
          </Form>
        </CardBody>
      </Card>
    </Page>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateMigas: (values) => {
      dispatch(updateMigas(values));
    },
  };
};
const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Configuracion);