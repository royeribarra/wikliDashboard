import React, { Fragment, useEffect, useState } from "react";
import { NavLink, useRouteMatch } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import { Table, Form } from "antd";
import { updateMigas } from "../../../redux/actions/routeActions";
import Buscar from "./buscar";
import { toastr } from "react-redux-toastr";
import Page from '../../../components/Page';
import { FiEdit } from "react-icons/fi";
import { BsEye } from "react-icons/bs";
import "antd/dist/antd.css";
import {
  Card,
  CardBody,
  CardHeader,
  Button as ButtonReactStrap
} from 'reactstrap';
import { PedidoService } from "../../../servicios/wiqli/pedidoService";
import { AdminPedidoService } from "../../../servicios/admin/adminPedidoService";
import {
  showLoader
} from "../../../redux/actions/loaderActions";
import { asignarUrlDescarga } from "../../../redux/actions/pedidoActions";

const Pedidos = ({ updateMigas }) => {
  let columns = [
    {
      title: "Orden",
      dataIndex: "id",
      width: 80,
      sorter: (a, b) => a.id - b.id,
      render: (id) => {
        return (
          <p>{id}</p>
        );
      }
    },
    {
      title: "Fecha de entrega",
      dataIndex: "fecha_entrega",
      width: 120,
      sorter: (a, b) => {
        let A = new Date(a.fecha_entrega);
        let B = new Date(b.fecha_entrega);
        // a.fecha_entrega - b.fecha_entrega
        return A-B;
      },
      render: (fecha_entrega) => {
        let newDate = new Date(fecha_entrega);
        return (
          <p>{newDate.toLocaleDateString()}</p>
        );
      }
    },
    {
      title: "Fecha de pedido",
      dataIndex: "created_at",
      width: 120,
      sorter: (a, b) => {
        let A = new Date(a.created_at);
        let B = new Date(b.created_at);
        return A-B;
      },
      render: (created_at) => {
        let newDate = new Date(created_at);
        return (
          <p>{newDate.toLocaleDateString()}</p>
        );
      }
    },
    {
      title: "Cliente",
      dataIndex: "cliente",
      width: 140,
      render: (cliente) => {
        return(
          <p>{cliente? cliente.nombres + '-' + cliente.apellidos : ''}</p>
        );
      }
    },
    {
      title: "Total a pagar",
      dataIndex: "total",
      width: 100,
      render: (total) => {
        return(
          <p>{total}</p>
        );
      }
    },
    {
      title: "Costo delivery",
      dataIndex: "costo_delivery",
      width: 100,
      render: (costo_delivery) => {
        return(
          <p>{costo_delivery}</p>
        );
      }
    },
    {
      title: "Número",
      dataIndex: "cliente",
      width: 140,
      render: (cliente) => {
        return(
          <p>{cliente? cliente.telefono : ''}</p>
        );
      }
    },
    {
      title: "Dirección",
      dataIndex: "cliente",
      width: 150,
      render: (cliente) => {
        return(
          <p>{cliente? cliente.direccion + '-' + cliente.referencia : ''}</p>
        );
      }
    },
    {
      title: "Editar",
      dataIndex: "id",
      width: 80,
      render: (id) => {
        return (
          <NavLink className="toggle__item" to={`/admin/pedido/${id}`}>
            <ButtonReactStrap color="warning"><FiEdit /></ButtonReactStrap>
          </NavLink>
        );
      },
    },
    {
      title: "Boleta",
      width: 100,
      render: (row) => {
        const verPdf = () => {
          pedidoService.verPdf().then(({data}) => {
            
          })
        }

        return(
          <a href = {`${process.env.REACT_APP_BASE_PATH}/wiqli/ver-pdf/${row.id}`} target = "_blank">
            <ButtonReactStrap size="sm">
              <BsEye/> PDF
            </ButtonReactStrap>
          </a>
          
        );
      }
    },
    {
      title: "Pagado",
      dataIndex: "",
      width: 100,
      render: (row) => {
        const { id, pagado } = row;
        return (
          <Fragment>
            {pagado > 0 ? (
              <ButtonReactStrap
                color="success"
                className="boton boton--verde boton-estado text-right"
                onClick={() => {
                  cancelarPagoPedido(id);
                }}
              >
                Pagado
              </ButtonReactStrap>
            ) : (
                <ButtonReactStrap
                  color="danger"
                  className="boton boton--plomo boton-estado text-right"
                  onClick={() => {
                    pagarTotalPedido(id);
                  }}
                >
                  Por pagar
                </ButtonReactStrap>
              )}
          </Fragment>
        );
      },
    },
    {
      title: "Se envió boleta",
      dataIndex: "",
      width: 100,
      render: (row) => {
        const { id, boletaEnviada } = row;
        return (
          <Fragment>
            {boletaEnviada > 0 ? (
              <ButtonReactStrap
                color="success"
              >
                SI
              </ButtonReactStrap>
            ) : (
                <ButtonReactStrap
                  color="danger"
                >
                  NO
                </ButtonReactStrap>
              )}
          </Fragment>
        );
      },
    },
    {
      title: "Estado",
      dataIndex: "",
      width: 100,
      render: (row) => {
        const { id, status } = row;
        return (
          <Fragment>
            {status > 0 ? (
              <ButtonReactStrap
                color="success"
                className="boton boton--verde boton-estado text-right"
                onClick={() => {
                  changeStatusPedido(id);
                }}
              >
                Activo
              </ButtonReactStrap>
            ) : (
                <ButtonReactStrap
                  color="danger"
                  className="boton boton--plomo boton-estado text-right"
                  onClick={() => {
                    changeStatusPedido(id);
                  }}
                >
                  Inactivo
                </ButtonReactStrap>
              )}
          </Fragment>
        );
      },
    },
  ];

  const dispatch = useDispatch();
  const pedidoService = new PedidoService("wiqli/pedidos");
  const adminPedidoService = new AdminPedidoService("admin/pedido");
  const { url, path } = useRouteMatch();
  const [form] = Form.useForm();
  const [selectedRowsArray, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
  });
  const [loading] = useState(false);

  useEffect(() => {
    updateMigas(url);

    if (!rows.length) {
      fetchAll();
    }
  }, []);

  const fetchAll = (paginationTab = pagination) => {
    dispatch(showLoader());
    const values = form.getFieldsValue();
    
    var fieldsValue = values;
    if(values.fecha){
        var fieldsValue = {
        ...values,
        'fechaInicial': values['fecha'][0].format('YYYY-MM-DD'),
        'fechaFinal': values['fecha'][1].format('YYYY-MM-DD')
      };
    }
    const searchObj = {
      ...fieldsValue,
      page: paginationTab? paginationTab.current : 1
    }

    pedidoService.getAll(searchObj).then(({ data }) => {
      setPagination({
        ...paginationTab,
        current: data.current,
        total: data.total,
      });
      setRows(data.data);
      dispatch(showLoader(false));
    });
  };

  const changeStatusPedido = (id) => {
    dispatch(showLoader());
    pedidoService.updateState(id).then(() => {
      fetchAll(pagination.current);
      dispatch(showLoader(false));
    });
  }

  const pagarTotalPedido = (id) => {
    dispatch(showLoader());
    adminPedidoService.pagarTotalPedido(id).then(() => {
      fetchAll(pagination.current);
      dispatch(showLoader(false));
    });
  }

  const cancelarPagoPedido = (id) => {
    dispatch(showLoader());
    adminPedidoService.cancelarPagoPedido(id).then(() => {
      fetchAll(pagination.current);
      dispatch(showLoader(false));
    });
  }

  const rowSelection = {
    selectedRowKeys: selectedRowsArray,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedRows(selectedRows);
      clearForm();
      if(selectedRowKeys.length>0){
        dispatch(asignarUrlDescarga({tipo: 3, keys: selectedRowKeys}));
      }else{
        dispatch(asignarUrlDescarga({tipo: 1}));
      }
      //console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
  };

  const enviarBoletasPedidoSeleccionados = () => {
    try {
      dispatch(showLoader());
      adminPedidoService.enviarBoletasCliente(selectedRows).then(({data})=> {
        fetchAll(pagination.current);
        dispatch(showLoader(false));
        toastr.success(data.message);
      });
    } catch (error) {
      toastr.error(error);
      dispatch(showLoader(false));
    }
    setSelectedRowKeys([]);
  };

  const clearForm = () => {
    form.setFieldsValue({
      fecha: null
    });
  };

  const clearSeleccionados = () =>{
    setSelectedRowKeys([]);
  };

  return (
    <Page title="Pedidos">
      <Buscar 
        form={form} 
        handleParentSearch={fetchAll}
        selectedRowsKeys={selectedRowsArray}
        clearSeleccionados={clearSeleccionados}
        clearForm={clearForm}
      />
      <Card style={{ marginTop: "15px" }}>
        <CardHeader>
          <h5>  Lista de Pedidos </h5>
          {
            selectedRowsArray.length > 0 && 
            <ButtonReactStrap onClick={enviarBoletasPedidoSeleccionados}>Enviar boletas de los pedidos seleccionados.</ButtonReactStrap>
          }
          
        </CardHeader>
        <CardBody>
          <Table
            className="table-wiqli-antd"
            rowSelection={rowSelection}
            columns={columns}
            rowKey={(record) => record.id}
            dataSource={rows}
            pagination={pagination}
            loading={loading}
            onChange={fetchAll}
            bordered
            scroll={{ x: 800 }}
          />
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

export default connect(mapStateToProps, mapDispatchToProps)(Pedidos);