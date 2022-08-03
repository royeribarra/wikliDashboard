import React, { useEffect, useState } from "react";

import { Card, CardHeader, CardBody } from 'reactstrap';
import { Pie } from 'react-chartjs-2';
import { EstadisticaService } from "../../../servicios/tienda/estadisticaService";
import { getColor } from 'utils/colors';

function MotivoProceso({fechas}) {
  const motivoService = new EstadisticaService("estadistica/motivo-procesos");
  const [data, setData] = useState({
    motivo1: 0, motivo2: 0, motivo3: 0, motivo4: 0, motivo5: 0
  });

  const getMotivos = () => {
    motivoService.getMotivoProceso(fechas).then(({data})=>{
      setData(data);
    })
  }

  const genPieData = () => {
    return {
      datasets: [
        {
          data: [data.motivo1, data.motivo2, data.motivo3, data.motivo4, data.motivo5],
          backgroundColor: [
            getColor('primary'),
            getColor('secondary'),
            getColor('success'),
            getColor('info'),
            getColor('danger')
          ],
          label: 'Dataset 1',
        },
      ],
      labels: [
        'No me quedó bien', 
        'No era lo que esperaba', 
        'Pedí otro producto por error', 
        'Me entregaron otro producto',
        'Producto dañado'
      ],
    };
  };

  useEffect(() => {
    getMotivos();
  }, [fechas]);

  return (
    <Card>
      <CardHeader>
        Motivo de procesos
      </CardHeader>
      <CardBody className="color-repo">
        {/* {
          motivos && 
          <C3Chart
            style={{ height: "24rem" }}
            data={{
              columns: [
                ["data1", motivo1],
                ["data2", motivo2],
                ["data3", motivo3],
                ["data4", motivo4],
                ["data5", motivo5]
              ],
              type: "pie",
              colors: {
                data1: "#A8C8E5",
                data2: "#ECBCBC",
                data3: "#BAEECA",
                data4: "#989CF9",
                data5: "#B6F0EF"
              },
              names: {
                data1: `No me quedó bien (${motivo1})`,
                data2: `No era lo que esperaba (${motivo2})`,
                data3: `Pedí otro producto por error (${motivo3})`,
                data4: `Me entregaron otro producto (${motivo4})`,
                data5: `Producto dañado (${motivo5})`
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

export default MotivoProceso;