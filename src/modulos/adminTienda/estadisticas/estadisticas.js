import React, { useState } from "react";
import { DatePicker, Form, Button } from 'antd';
import DesgloseByTipoProceso from "./desgloseByTipoProceso";
import OrdenesTotales from "./ordenesTotales";
import EstadoProcesos from "./estadoProcesos";
import MotivoProceso from "./motivoProceso";
import MontoTotalTipoProceso from "./montoTotalTipoProceso";
import { EstadisticaService } from "../../../servicios/tienda/estadisticaService";
import Page from "../../../components/Page";
import { Row, Col, Card, CardBody, CardHeader } from "reactstrap";
const { RangePicker } = DatePicker;

function Estadisticas() {
  const service = new EstadisticaService("estadistica/fechas");
  const [fechas, setFechas] = useState();
  const searchData = (values) => {
    var newVal = [];
    values.fecha.forEach((el) => {
      newVal.push(el.format("YYYY-MM-DD"));
    })
    setFechas(newVal);
    service.getFechas(newVal).then(({data}) => {
    })
  }

  return (
    <Page title="Estadística">
      <Card>
        <CardHeader>
          Buscar
        </CardHeader>
        <CardBody>
          <Form onFinish={searchData}>
            <Form.Item name="fecha">
              <RangePicker />
            </Form.Item>
            <Form.Item>
              <Button style={{ backgroundColor: "#66F1E0"}} htmlType="submit">
                Buscar
              </Button>
            </Form.Item>
          </Form>
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          <Row>
            <Col xl={6} lg={12} md={12}>
              <DesgloseByTipoProceso fechas={fechas} />
            </Col>
            <Col xl={6} lg={12} md={12}>
              <MotivoProceso fechas={fechas} />
            </Col>
          </Row>
          <Row>
            <Col xl={6} lg={12} md={12}>
              <EstadoProcesos fechas={fechas} />
            </Col>
            <Col xl={6} lg={12} md={12}>
              <OrdenesTotales fechas={fechas} />
            </Col>
            <Col xl={6} lg={12} md={12}>
              <MontoTotalTipoProceso fechas={fechas} />
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Page>
  );
}

export default Estadisticas;