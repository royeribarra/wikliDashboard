import React, { useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import { connect } from "react-redux";
import { Form } from "antd";
import { ScrapService } from "../../../servicios/admin/scrapService";
import { updateMigas } from "../../../redux/actions/routeActions";
import Buscar from "./buscar";
import { Card, CardBody, Table as TableStrap } from "reactstrap";
import Page from '../../../components/Page';


const PrecioComparativo = ({ updateMigas }) => {
  const scrapService = new ScrapService("wiqli/precios-comparacion");
  const { url } = useRouteMatch();
  const [form] = Form.useForm();
  const [fechaInicial, setFechaInicial] = useState();
  const [fechaFinal, setFechaFinal] = useState();
  const [info, setInfo] = useState({
    perCarnes: 0,
    perFrutas: 0,
    perMenestras: 0,
    perVerduras: 0,
    totalOtrosCarnes: 0,
    totalOtrosFrutas: 0,
    totalOtrosMenestras: 0,
    totalOtrosVerduras: 0,
    totalWiqliCarnes: 0,
    totalWiqliFrutas: 0,
    totalWiqliMenestras: 0,
    totalWiqliVerduras: 0,
  });

  useEffect(() => {
    updateMigas(url);
    fetchAll();
  }, []);

  const fetchAll = () => {
    const values1 = form.getFieldsValue();
    const rangeValue = values1['week'];
    setFechaFinal(rangeValue[0].format('YYYY-MM-DD'));
    setFechaInicial(rangeValue[1].format('YYYY-MM-DD'));
    const values = {
      ...form.getFieldsValue(),
      'week': [rangeValue ? rangeValue[0].format('YYYY-MM-DD') : '', rangeValue ? rangeValue[1].format('YYYY-MM-DD') : '']
    };

    scrapService.getAll(values).then(({ data }) => {
      setInfo(data);
    });
  };

  return (
    <Page title="Total comparativo de precios">
      <Buscar titulo="Buscar usuario" form={form} handleParentSearch={fetchAll}/>
      <Card>
        <CardBody>
          <TableStrap className="table table-bordered">
            <thead>
              <tr>
                <th rowSpan={2}>Semana</th>
                <th colSpan={3}>Frutas</th>
                <th colSpan={3}>Verduras</th>
                <th colSpan={3}>Carnes</th>
                <th colSpan={3}>Menestras</th>
              </tr>
              <tr>
                <th>Precio Wiqli</th>
                <td>Promedio precio otros</td>
                <td>%</td>
                <th>Precio Wiqli</th>
                <td>Promedio precio otros</td>
                <td>%</td>
                <th>Precio Wiqli</th>
                <td>Promedio precio otros</td>
                <td>%</td>
                <th>Precio Wiqli</th>
                <td>Promedio precio otros</td>
                <td>%</td>
              </tr>
            </thead>
            <tbody>
            <tr>
              <td>{fechaInicial + ' - ' + fechaFinal}</td>
              <td>{info.totalWiqliFrutas.toFixed(2)}</td>
              <td>{info.totalOtrosFrutas.toFixed(2)}</td>
              <td>{info.perFrutas.toFixed(2)}</td>
              <td>{info.totalWiqliVerduras.toFixed(2)}</td>
              <td>{info.totalOtrosVerduras.toFixed(2)}</td>
              <td>{info.perVerduras.toFixed(2)}</td>
              <td>{info.totalWiqliCarnes.toFixed(2)}</td>
              <td>{info.totalOtrosCarnes.toFixed(2)}</td>
              <td>{info.perCarnes.toFixed(2)}</td>
              <td>{info.totalWiqliMenestras.toFixed(2)}</td>
              <td>{info.totalOtrosMenestras.toFixed(2)}</td>
              <td>{info.perMenestras.toFixed(2)}</td>
            </tr>
            </tbody>
          </TableStrap>
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

export default connect(mapStateToProps, mapDispatchToProps)(PrecioComparativo);