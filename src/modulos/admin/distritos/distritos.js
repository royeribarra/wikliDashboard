import React, { Fragment, useEffect, useState } from "react";
import { NavLink, useRouteMatch } from "react-router-dom";
import { connect } from "react-redux";
import { Table, Form } from "antd";
import { DistritoService } from "../../../servicios/distritoService";
import { updateMigas } from "../../../redux/actions/routeActions";
import Page from '../../../components/Page';

import {
  Card,
  CardBody,
  CardHeader,
  Button
} from 'reactstrap';

const Distritos = ({ updateMigas }) => {
  const distritoService = new DistritoService("distritos");
  const { url, path } = useRouteMatch();
  const [form] = Form.useForm();

  let columns = [
    {
      title: "Nombre",
      dataIndex: "nombre",
      sorter: true,
      width: "25%",
    },
    {
      title: "Estado",
      dataIndex: "",
      render: (row) => {
        const { id, activo } = row;
        return (
          <Fragment>
            {activo ? (
              <Button
                color="success"
                className="boton boton--verde boton-estado text-right"
                onClick={() => {
                  changeStatusUsers(id, activo);
                }}
              >
                Activo
              </Button>
            ) : (
                <Button
                  color="danger"
                  className="boton boton--plomo boton-estado text-right"
                  onClick={() => {
                    changeStatusUsers(id, activo);
                  }}
                >
                  Inactivo
                </Button>
              )}
          </Fragment>
        );
      },
    }
  ];

  const [rows, setRows] = useState([]);
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

  const changeStatusUsers = (id, state) => {
    const dataChangeStatus = {
      id,
      state,
    };

    distritoService.changeStatus(dataChangeStatus).then(() => {
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
    const values = form.getFieldsValue();
    const searchObj = {
      ...values,
      page: paginationTab? paginationTab.current : 1
    }

    distritoService.getAll(searchObj).then(({ data }) => {
      setPagination({
        ...paginationTab,
        current: data.current,
        total: data.total,
      });
      setRows(data.data);
    });
  };

  return (
    <Page title="Distritos">
      <Card>
        <CardHeader>
          Lista de distritos
        </CardHeader>
        <CardBody>
          <NavLink
            exact={false}
            to={`${path}/crear`}
          >
            <Button style={{ marginBottom: "15px" }}>Crear Distrito</Button>
          </NavLink>
          <div className="caja-contenedor__body">
            <Table
              columns={columns}
              rowKey={(record) => record.id}
              dataSource={rows}
              pagination={pagination}
              loading={loading}
              onChange={fetchAll}
            />
          </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Distritos);