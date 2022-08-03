import React, { Fragment, useEffect, useState } from "react";
import { NavLink, useRouteMatch } from "react-router-dom";
import { connect } from "react-redux";
import { Table, Form } from "antd";
import { TiendaService } from "../../../servicios/tiendaService";
import { updateMigas } from "../../../redux/actions/routeActions";
import Buscar from "./buscar";
import { Card, CardBody, CardHeader, Button as ButtonStrap } from "reactstrap";
import Page from 'components/Page';

const Tiendas = ({ updateMigas }) => {
  const tiendaService = new TiendaService("stores");
  const { url, path } = useRouteMatch();
  const [form] = Form.useForm();

  let columns = [
    {
      title: "Nombre",
      dataIndex: "business_name",
      sorter: true,
      width: "25%",
    },
    {
      title: "RUC",
      dataIndex: "ruc",
    },
    {
      title: "Celular",
      dataIndex: "phone",
    },
    {
      title: "Lugar de atención",
      dataIndex: "address",
    },
    {
      title: "Contacto",
      dataIndex: "contacto",
      render: (contacto) => {
        return(
          <p>{contacto? contacto.nombre_contacto + ' ' + contacto.apellido_contacto: ''}</p>
        );
      }
    },
    {
      title: "Teléfono contacto",
      dataIndex: "contacto",
      render: (contacto) => {
        return(
          <p>{contacto? contacto.telefono_contacto : ''}</p>
        );
      }
    },
    {
      title: "Estado",
      dataIndex: "",
      render: (row) => {
        const { id, state } = row;
        return (
          <Fragment>
            {state ? (
              <ButtonStrap
                color="success"
                className="boton boton--verde boton-estado text-right"
                onClick={() => {
                  changeStatusUsers(id, state);
                }}
              >
                Activo
              </ButtonStrap>
            ) : (
                <ButtonStrap
                  color="danger"
                  className="boton boton--plomo boton-estado text-right"
                  onClick={() => {
                    changeStatusUsers(id, state);
                  }}
                >
                  Inactivo
                </ButtonStrap>
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
          <NavLink className="toggle__item" to={`/admin/tiendas/${id}`}>
            <ButtonStrap color="warning">Editar</ButtonStrap>
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

  const changeStatusUsers = (id, state) => {
    const dataChangeStatus = {
      id,
      state,
    };

    tiendaService.changeStatus(dataChangeStatus).then(() => {
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

    tiendaService.getAll(searchObj).then(({ data }) => {
      setPagination({
        ...paginationTab,
        current: data.current,
        total: data.total,
      });
      setRows(data.data);
    });
  };

  return (
    <Page title="Tiendas">
      <Buscar form={form} handleParentSearch={fetchAll}/>
      <Card>
        <CardHeader>
          Lista de tiendas
        </CardHeader>
        <CardBody>
          <div>
            <NavLink
              exact={false}
              to={`tienda/crear`}
              className="item__link boton  boton--transparent-azul "
            >
              <ButtonStrap style={{ marginBottom: "10px" }}>Crear Tienda</ButtonStrap>
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
              scroll={{ x: 1200}}
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

export default connect(mapStateToProps, mapDispatchToProps)(Tiendas);