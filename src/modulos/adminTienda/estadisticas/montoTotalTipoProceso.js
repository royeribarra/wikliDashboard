import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, Badge, ListGroup,
  ListGroupItem } from 'reactstrap';

import { EstadisticaService } from "../../../servicios/tienda/estadisticaService";
import {
  MdBubbleChart,
  MdInsertChart,
  MdPieChart,
  MdShowChart
} from 'react-icons/md';

function MontoTotalTipoProceso({fechas}) {
  const montoService = new EstadisticaService("estadistica/monto-total-tipo-proceso");
  const [montos, setMontos] = useState({
    total_cambios: 0, total_devoluciones: 0, total_nuevos_productos: 0, upselling: 0
  });

  const getMontos = () => {
    montoService.getMontoTotalTipoProceso(fechas).then(({data})=>{
      setMontos(data)
    })
  }

  useEffect(() => {
    getMontos();
  }, [fechas]);

  return (
    <Card>
      <CardHeader>
        Monto Total por Tipo de Proceso (S/)
      </CardHeader>
      <CardBody>
        {/* <Row>
          <Col lg={4} md={6} sm={6} xs={12} className="mb-3">
            <NumberWidget
              title="Monto Total Productos Devueltos"
              
              number={montos.total_cambios}
              color="primary"
              
            />
          </Col>
        </Row> */}
        <ListGroup flush>
          <ListGroupItem>
            <MdInsertChart size={25} color="primary" /> Monto Total Productos Devueltos: {' '}
            <Badge color="secondary">{montos.total_cambios}</Badge>
          </ListGroupItem>
          <ListGroupItem>
            <MdBubbleChart size={25} color="primary" /> Monto Total Productos Cambiados: {' '}
            <Badge color="secondary">{montos.total_devoluciones}</Badge>
          </ListGroupItem>
          <ListGroupItem>
            <MdShowChart size={25} color="primary" /> Monto Total de Venta Adicional: {' '}
            <Badge color="secondary">{montos.total_nuevos_productos}</Badge>
          </ListGroupItem>
          <ListGroupItem>
            <MdPieChart size={25} color="primary" /> % Upselling: {' '}
            <Badge color="secondary">{montos.upselling}</Badge>
          </ListGroupItem>
        </ListGroup>
        {/* {
          montos && 
            <>
              <div
                color="blue"
                icon="dollar-sign"
                header={
                  <h3>
                    <small>Monto Total Productos Devueltos: </small> {montos.total_cambios}
                  </h3>
                }
                footer={""}
              />
              <div
                color="blue"
                icon="dollar-sign"
                header={
                  <h3>
                    <small>Monto Total Productos Cambiados: </small> {montos.total_devoluciones}
                  </h3>
                }
                footer={""}
              />
              <div
                color="blue"
                icon="dollar-sign"
                header={
                  <h3>
                    <small>Monto Total de Venta Adicional: </small> {montos.total_nuevos_productos}
                  </h3>
                }
                footer={montos.upselling + "% Upselling"  }
              />
            </>
        } */}
      </CardBody>
    </Card>
  );
}

export default MontoTotalTipoProceso;