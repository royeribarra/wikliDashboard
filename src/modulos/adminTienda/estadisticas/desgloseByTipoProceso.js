import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody } from 'reactstrap';
import { Pie } from 'react-chartjs-2';
import { EstadisticaService } from "../../../servicios/tienda/estadisticaService";
import { getColor } from 'utils/colors';

function DesgloseByTipoProceso({fechas}) {
  const service = new EstadisticaService("estadistica/desglose-tipo-proceso");
  const [data, setData] = useState({
    devolucion: 0, estandar: 0, express: 0, servicioTecnico: 0
  });

  const getData = () => {
    service.getDesgloseByTipoProceso(fechas).then(({data})=>{
      setData(data);
    })
  }

  useEffect(() => {
    getData();
  }, [fechas]);

  const genPieData = () => {
    return {
      datasets: [
        {
          data: [data.devolucion, data.estandar, data.express, data.servicioTecnico],
          backgroundColor: [
            getColor('primary'),
            getColor('secondary'),
            getColor('success'),
            getColor('info')  
          ],
          label: 'Dataset 1',
        },
      ],
      labels: ['Devoluciones', 'Cambios Estándar', 'Cambios Express', 'Servicio Técnico'],
    };
  };

  return (
    <Card>
      <CardHeader>
        Desglose por tipo de proceso
      </CardHeader>
      <CardBody>
        {/* {
          data && 
          <C3Chart
            style={{ height: "24rem" }}
            data={{
              columns: [
                ["data1", estandar],
                ["data2", express],
                ["data3", devolucion],
                ["data4", servicioTecnico],
              ],
              type: "pie",
              colors: {
                data1: "#77F3E2",
                data2: "#989CF9",
                data3: "#E7E9FF",
                data4: "#E7E9FF",
              },
              names: {
                data1: `Estándar (${estandar})`,
                data2: `Express (${express})`,
                data3: `Devolución (${devolucion})`,
                data4: `Servicio Técnico (${servicioTecnico})`
              },
            }}
            legend={{
              show: true,//hide legend
            }}
            color = {{

            }}

            padding={{
              bottom: 0,
              top: 0,
            }}
          />
        } */}
        <Pie data={genPieData()} />
      </CardBody>
    </Card>
  );
}

export default DesgloseByTipoProceso;