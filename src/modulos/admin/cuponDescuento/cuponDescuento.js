import React, { useEffect, useState, useRef } from "react";
import { NavLink, useRouteMatch } from "react-router-dom";
import { connect } from "react-redux";
import { Table, Form, Upload, Button, Image } from "antd";
import { CuponService } from "../../../servicios/admin/cuponService";
import { updateMigas } from "../../../redux/actions/routeActions";
import Buscar from "./buscar";
import { STORAGE_URL } from "../../../config/constants";
import { toastr } from "react-redux-toastr";
import Page from '../../../components/Page';
import {
  Card,
  CardBody,
  CardHeader,
  Button as ButtonReact
} from 'reactstrap';
import DeleteDescuento from "./deleteDescuento";
import ModalConfirmacionReferente from "./modalConfirmacionReferente";

const CuponDescuento = ({ updateMigas }) => {
  const cuponService = new CuponService("wiqli/cupones-descuento");
  const { url, path } = useRouteMatch();
  const [form] = Form.useForm();
  const [filesRecorded, setFilesRecorded] = useState([]);
  const btnUploadFileRecorded = useRef(null);
  const [showDelModal, setShowDelModal] = useState(false);
  const [showModalConfirmacionReferente, setShowModalConfirmacionReferente] = useState(false);
  const [activeRow, setActiveRow] = useState({});
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [loading] = useState(false);

  const handleTableChangeUser = (values) => {
    const { current } = values;
    fetchAll(current);
  };

  const fetchAll = (paginationTab = pagination) => {
    
    const values = form.getFieldsValue();
    const searchObj = {
      ...values,
      page: paginationTab? paginationTab.current : 1
    }

    cuponService.getAll(searchObj).then(({ data }) => {
      setPagination({
        ...paginationTab,
        current: paginationTab.current,
        total: data.total,
      });
      setRows(data.data);
    });
  };

  const handleParentSearch = () => {
    let newPagination = {
      current: 1,
      pageSize: 10,
      total: 0,
    }
    fetchAll(newPagination);
  }

  const deleteRecord = (id, row) => {
    setActiveRow(row);
    setShowDelModal(true);
  };

  const changeStatusCupon = (cuponId) => {
    cuponService.updateState(cuponId).then(({data}) => {
      fetchAll(pagination.current);
      toastr.success("Estado actualizado");
    });
  }

  const confirmarCreacionCuponReferente = () => {
    setShowModalConfirmacionReferente(true);
  }

  useEffect(() => {
    updateMigas(url);

    if (!rows.length) {
      fetchAll();
    }
  }, []);

  let columns = [
    {
      title: "Correo creador",
      dataIndex: "correo_creador",
      sorter: true,
      render: (correo_creador) => {
        return (
          <p>{correo_creador}</p>
        );
      }
    },
    {
      title: "Código",
      dataIndex: "codigo",
      sorter: true,
      render: (codigo) => {
        return (
          <p>{codigo}</p>
        );
      }
    },
    {
      title: "Monto",
      dataIndex: "monto",
      render: (monto) => {
        return (
          <p>{monto}</p>
        );
      }
    },
    {
      title: "Fecha expiración",
      dataIndex: "fecha_expiracion",
      render: (fecha_expiracion) => {
        return (
          <p>{fecha_expiracion}</p>
        );
      }
    },
    {
      title: "Cantidad expiracion",
      dataIndex: "cantidad_expiracion",
      render: (cantidad_expiracion) => {
        return (
          <p>{cantidad_expiracion}</p>
        );
      }
    },
    {
      title: "Tipo cupon",
      dataIndex: "tipo",
      render: (tipo) => {
        return (
          <p>{tipo === 1 ? 'Variable' : 'Fijo'}</p>
        );
      },
    },
    {
      title: "Editar",
      dataIndex: "id",
      render: (id) => {
        return (
          <NavLink className="toggle__item" to={`/admin/cupon-descuento/${id}`}>
            <ButtonReact color="warning">Editar</ButtonReact>
          </NavLink>
        );
      },
    },
    {
      title: "Estado",
      dataIndex: "",
      render: (row) => {
        const { id, activo } = row;
        return (
          <>
            {activo ? (
              <ButtonReact
                color="success"
                className="boton boton--verde boton-estado text-right"
                onClick={() => {
                  changeStatusCupon(id);
                }}
              >
                Activo
              </ButtonReact>
            ) : (
                <ButtonReact
                  color="danger"
                  className="boton boton--plomo boton-estado text-right"
                  onClick={() => {
                    changeStatusCupon(id);
                  }}
                >
                  Inactivo
                </ButtonReact>
              )}
          </>
        );
      },
    },
  ];

  return (
    <Page title="Productos">
      <Buscar form={form} handleParentSearch={handleParentSearch}/>
      <Card>
        <CardHeader>Lista de cupones</CardHeader>
        <CardBody>
          <div className="row">
            <div className="col-md-6">
              <NavLink
                exact={false}
                to={`cupones-descuento/crear`}
                className="item__link boton  boton--transparent-azul "
              >
                <ButtonReact color="primary" className="mr-1">
                  Crear Cupon
                </ButtonReact>
              </NavLink>
            </div>
            <div className="col-md-6">
              <ModalConfirmacionReferente
                status={showModalConfirmacionReferente}
                handleClose={setShowModalConfirmacionReferente}
              />
              <ButtonReact color="primary" className="mr-1" onClick={confirmarCreacionCuponReferente}>
                Generar cupon referente
              </ButtonReact>
            </div>
          </div>
          <div>
            <Table
              columns={columns}
              rowKey={(record) => record.id}
              dataSource={rows}
              pagination={pagination}
              loading={loading}
              onChange={fetchAll}
              bordered
            />
            <DeleteDescuento
              status={showDelModal}
              handleClose={setShowDelModal}
              handleRefreshTable={fetchAll}
              activeRow={activeRow}
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

export default connect(mapStateToProps, mapDispatchToProps)(CuponDescuento);