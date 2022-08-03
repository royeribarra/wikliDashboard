import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Col, Row } from 'reactstrap';
import { EstadisticaService } from "../../../servicios/tienda/estadisticaService";
import { NumberWidget } from 'components/Widget';

function OrdenesTotales({fechas}) {
  const ordenesService = new EstadisticaService("estadistica/ordenes-totales");
  const efectividadService = new EstadisticaService("estadistica/efectividad-ordenes");
  const [ordenes, setOrdenes] = useState({
    cambios: 0, devoluciones: 0, gestiones: 0, servicioTecnico: 0
  });
  const [efectividad, setEfectividad] = useState({
    cambios_aceptados: 0, devoluciones_aceptadas: 0
  });

  const getOrdenes = () => {
    ordenesService.getDesgloseByTipoProceso(fechas).then(({data})=>{
      setOrdenes(data)
    })
  }

  const getEfectividad = () => {
    efectividadService.getEfectividadOrdenes(fechas).then(({data})=>{
      setEfectividad(data)
    })
  }

  useEffect(() => {
    getOrdenes();
    getEfectividad();
  }, [fechas]);

  return (
    <Card>
      <CardHeader>
        Órdenes totales
      </CardHeader>
      <CardBody>
        <Row>
          <Col lg={4} md={6} sm={6} xs={12} className="mb-3">
            <NumberWidget
              title="Cambios"
              subtitle="Efectividad"
              number={ordenes.cambios}
              color="primary"
              progress={{
                value: (efectividad.cambios_aceptados/ordenes.cambios)*100
              }}
            />
          </Col>
          <Col lg={4} md={6} sm={6} xs={12} className="mb-3">
            <NumberWidget
              title="Devoluciones"
              subtitle="Efectividad"
              number={ordenes.devoluciones}
              color="primary"
              progress={{
                value: (efectividad.devoluciones_aceptadas/ordenes.devoluciones)*100
              }}
            />
          </Col>
          <Col lg={4} md={6} sm={6} xs={12} className="mb-3">
            <NumberWidget
              title="Servicio Técnico"
              subtitle="Efectividad"
              number={ordenes.servicioTecnico}
              color="primary"
            />
          </Col> 
        </Row>
          {/* <>
          <div
            
            color="blue"
            icon="hash"
            header={
              <h3>
                {ordenes.cambios} <small>Cambios</small>
              </h3>
            }
            footer={efectividad.cambios_aceptados + "% Aceptación"}
          />
          <div
            color="blue"
            icon="hash"
            header={
              <h3>
                {ordenes.devoluciones} <small>Devoluciones</small>
              </h3>
            }
            footer={efectividad.devoluciones_aceptadas + "% Aceptación"}
          />
          <div
            color="blue"
            icon="hash"
            header={
              <h3>
                {ordenes.servicioTecnico} <small>Servicio Técnico</small>
              </h3>
            }
          />
        </> */}
      </CardBody>
    </Card>
  );
}

export default OrdenesTotales;