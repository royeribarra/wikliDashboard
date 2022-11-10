import React, { Fragment, useEffect, useState } from "react";
import { NavLink, useRouteMatch } from "react-router-dom";
import { connect } from "react-redux";
import { Table, Form } from "antd";
import { ScrapService } from "../../../servicios/admin/scrapService";
import { updateMigas } from "../../../redux/actions/routeActions";
import Buscar from "./buscar";
import { Card, CardBody, CardHeader, Button, Table as TableStrap } from "reactstrap";
import Page from 'components/Page';

const tableTypes = ['', 'bordered', 'striped', 'hover'];

const PrecioComparativo = ({ updateMigas }) => {
  const scrapService = new ScrapService("wiqli/precios-comparacion");
  const { url, path } = useRouteMatch();
  const [form] = Form.useForm();
  const [rows, setRows] = useState([]);
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
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
  });
  const [loading] = useState(false);
  const handleTableChangeUser = (values) => {
    const { current } = values;
    fetchAll(current);
  };

  const changeStatusUsers = (id) => {
    const dataChangeStatus = {
      id
    };

    scrapService.updateState(id).then(() => {
      fetchAll(pagination.current);
    });
  };

  useEffect(() => {
    updateMigas(url);

    if (!rows.length) {
      fetchAll();
    }
  }, []);

  const fetchAll = (paginationTab = pagination) => {
    const values1 = form.getFieldsValue();
    const rangeValue = values1['week'];
    setFechaFinal(rangeValue[0].format('YYYY-MM-DD'));
    setFechaInicial(rangeValue[1].format('YYYY-MM-DD'));
    const values = {
      ...form.getFieldsValue(),
      'week': [rangeValue ? rangeValue[0].format('YYYY-MM-DD') : '', rangeValue ? rangeValue[1].format('YYYY-MM-DD') : '']
    };
    const searchObj = {
      ...values,
      page: paginationTab? paginationTab.current : 1
    }

    scrapService.getAll(searchObj).then(({ data }) => {
      setInfo(data);
      setPagination({
        ...paginationTab,
        current: data.current,
        total: data.total,
      });
      setRows(data.data);
    });
  };

  let columns = [
    {
      title: "Tienda",
      dataIndex: "tienda",
      render: (tienda) => {
        const lugar = tienda ? tienda.business_name : 'Repo';
        return (
          <Fragment>
            {lugar}
          </Fragment>
        );
      },
    },
    {
      title: "Nombres y apellidos",
      dataIndex: "fullname",
      sorter: true
    },
    {
      title: "DNI",
      dataIndex: "dni",
    },
    {
      title: "Celular",
      dataIndex: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Cargo",
      dataIndex: "rol",
      render: (rol) => {
        return <Fragment>{rol.name}</Fragment>;
      },
    },
    {
      title: "Estado",
      dataIndex: "",
      render: (row) => {
        const { id, state } = row;
        return (
          <Fragment>
            {state ? (
              <Button
                color="success"
                className="boton boton--verde boton-estado text-right"
                onClick={() => {
                  changeStatusUsers(id);
                }}
              >
                Activo
              </Button>
            ) : (
                <Button
                  color="danger"
                  className="boton boton--plomo boton-estado text-right"
                  onClick={() => {
                    changeStatusUsers(id);
                  }}
                >
                  Inactivo
                </Button>
              )}
          </Fragment>
        );
      },
    },
    {
      title: "Editar",
      dataIndex: "id",
      render: (id) => {
        return (
          <NavLink className="toggle__item" to={`/admin/usuarios/${id}`}>
            <Button color="warning">Editar</Button>
          </NavLink>
        );
      },
    },
  ];

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
                <td>{info.totalWiqliFrutas}</td>
                <td>{info.totalOtrosFrutas}</td>
                <td>{info.perFrutas.toFixed(2)}</td>
                <td>{info.totalWiqliVerduras}</td>
                <td>{info.totalOtrosVerduras}</td>
                <td>{info.perVerduras.toFixed(2)}</td>
                <td>{info.totalWiqliCarnes}</td>
                <td>{info.totalOtrosCarnes}</td>
                <td>{info.perCarnes.toFixed(2)}</td>
                <td>{info.totalWiqliMenestras}</td>
                <td>{info.totalOtrosMenestras}</td>
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