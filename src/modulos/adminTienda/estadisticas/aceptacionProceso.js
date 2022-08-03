import React from "react";
import "tabler-react/dist/Tabler.css";

import { EstadisticaService } from "../../../servicios/tienda/estadisticaService";

function AceptacionProceso() {
  const aceptacionProcesoService = new EstadisticaService("estadistica/aceptacion-proceso");

  return (
    <Card>
      <Card.Header>
        <Card.Title>Aceptación Proceso (%)</Card.Title>
      </Card.Header>
      <Card.Body>
        <div
          color="blue"
          icon="dollar-sign"
          header={
            <a href="#">
              132 <small>Cambios</small>
            </a>
          }
          footer={"12 waiting payments"}
        />
        <div
          color="blue"
          icon="dollar-sign"
          header={
            <a href="#">
              132 <small>Devoluciones</small>
            </a>
          }
          footer={"12 waiting payments"}
        />
      </Card.Body>
    </Card>
  );
}

export default AceptacionProceso;