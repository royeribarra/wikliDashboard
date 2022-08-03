import React, { Fragment, useEffect, useState } from "react";
import { NavLink, useRouteMatch } from "react-router-dom";
import { connect } from "react-redux";
import { Table, Form } from "antd";
import { UserService } from "../../../servicios/userService";
import { updateMigas } from "../../../redux/actions/routeActions";
import Buscar from "./buscar";
import { Card, CardBody, CardHeader, Button } from "reactstrap";
import Page from 'components/Page';

const Usuarios = ({ updateMigas }) => {
  const userService = new UserService("users");
  const { url, path } = useRouteMatch();
  const [form] = Form.useForm();

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

  const changeStatusUsers = (id) => {
    const dataChangeStatus = {
      id
    };

    userService.updateState(id).then(() => {
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

    userService.getAll(searchObj).then(({ data }) => {
      setPagination({
        ...paginationTab,
        current: data.current,
        total: data.total,
      });
      setRows(data.data);
    });
  };

  return (
    <Page title="Usuarios">
      <Buscar titulo="Buscar usuario" form={form} handleParentSearch={fetchAll}/>
      <Card>
        <CardHeader>
          Lista de usuarios
        </CardHeader>
        <CardBody>
          <div>
            <NavLink
              exact={false}
              to={`usuario/crear`}
            >
              <Button style={{ marginBottom: "15px" }}>Crear Usuario</Button>
            </NavLink>
          </div>
          <div>
            <Table
              columns={columns}
              rowKey={(record) => record.id}
              dataSource={rows}
              pagination={pagination}
              loading={loading}
              onChange={fetchAll}
              scroll={{ x: 1500}}
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

export default connect(mapStateToProps, mapDispatchToProps)(Usuarios);
