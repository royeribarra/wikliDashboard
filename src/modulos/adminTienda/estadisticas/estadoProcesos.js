import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody } from 'reactstrap';
import { EstadisticaService } from "../../../servicios/tienda/estadisticaService";
import { getColor } from 'utils/colors';
import { Pie} from 'react-chartjs-2';

function EstadoProcesos({fechas}) {
  const estadoService = new EstadisticaService("estadistica/estado-procesos");
  const [data, setData] = useState({
    aceptado: 0, proceso: 0, rechazado: 0
  });

  const getEstados = () => {
    estadoService.getEstadoProcesos(fechas).then(({data})=>{
      setData(data);
    })
  }

  const genPieData = () => {
    return {
      datasets: [
        {
          data: [data.proceso, data.aceptado, data.rechazado],
          backgroundColor: [
            getColor('primary'),
            getColor('secondary'),
            getColor('success')
          ],
          label: 'Dataset 1',
        },
      ],
      labels: [
        'En proceso', 
        'Aceptado', 
        'Rechazado'
      ],
    };
  };

  useEffect(() => {
    getEstados();
  }, [fechas]);

  return (
    <Card>
      <CardHeader>
        Estado de procesos
      </CardHeader>
      <CardBody>
        {/* {
          procesos && 
            <C3Chart
              style={{ height: "24rem" }}
              data={{
                columns: [
                  ["data1", proceso],
                  ["data2", aceptado],
                  ["data3", rechazado]
                ],
                type: "pie",
                colors: {
                  data1: "#989CF9",
                  data2: "#ECBCBC",
                  data3: "#BAEECA"
                },
                names: {
                  data1: `Proceso (${proceso})`,
                  data2: `Aceptado (${aceptado})`,
                  data3: `Rechazado (${rechazado})`
                },
              }}
              legend={{
                show: true, //hide legend
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

export default EstadoProcesos;