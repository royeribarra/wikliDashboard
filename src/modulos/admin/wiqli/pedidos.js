import React, { Fragment, useEffect, useState } from "react";
import { NavLink, useRouteMatch } from "react-router-dom";
import { connect } from "react-redux";
import { Table, Form, Space, Popover, Button } from "antd";
import { updateMigas } from "../../../redux/actions/routeActions";
import Buscar from "./buscar";
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import { toastr } from "react-redux-toastr";
import Page from '../../../components/Page';

import {
  Card,
  CardBody,
  CardHeader,
  Button as ButtonReactStrap
} from 'reactstrap';
import { PedidoService } from "../../../servicios/wiqli/pedidoService";

const Pedidos = ({ updateMigas }) => {
  const pedidoService = new PedidoService("wiqli/pedidos");
  const { url, path } = useRouteMatch();
  const [form] = Form.useForm();
  const [carriers, setCarriers] = useState([]);
  const [dia, setDia] = useState();

  let columns = [
    {
      title: "Número de orden",
      dataIndex: "id",
      render: (id) => {
        return (
          <p>{id}</p>
        );
      }
    },
    {
      title: "Estatus",
      dataIndex: "status",
      render: (status) => {
        return (
          <p>{status === 1 ? 'Creado' : 'Completado'}</p>
        );
      }
    },
    {
      title: "Fecha de entrega",
      dataIndex: "fecha_entrega",
      render: (fecha_entrega) => {
        return (
          <p>{fecha_entrega}</p>
        );
      }
    },
    {
      title: "Fecha de pedido",
      dataIndex: "created_at",
      render: (created_at) => {
        return (
          <p>{created_at.substring(0, 10)}</p>
        );
      }
    },
    {
      title: "Cliente",
      dataIndex: "cliente",
      render: (cliente) => {
        return(
          <p>{cliente? cliente.nombres + '-' + cliente.apellidos : ''}</p>
        );
      }
    },
    {
      title: "Total a pagar",
      dataIndex: "total",
      render: (total) => {
        return(
          <p>{total}</p>
        );
      }
    },
    {
      title: "Costo delivery",
      dataIndex: "costo_delivery",
      render: (costo_delivery) => {
        return(
          <p>{costo_delivery}</p>
        );
      }
    },
    {
      title: "Número",
      dataIndex: "cliente",
      render: (cliente) => {
        return(
          <p>{cliente? cliente.telefono : ''}</p>
        );
      }
    },
    {
      title: "Dirección",
      dataIndex: "cliente",
      render: (cliente) => {
        return(
          <p>{cliente? cliente.direccion + '-' + cliente.referencia : ''}</p>
        );
      }
    },
    {
      title: "Editar",
      dataIndex: "id",
      render: (id) => {
        return (
          <NavLink className="toggle__item" to={`/admin/pedido/${id}`}>
            <Button color="warning">Editar</Button>
          </NavLink>
        );
      },
    },
    {
      title: "Productos",
      dataIndex: "detalle",
      render: (detalle) => {
        const columnas = [
          {
            title: "Producto",
            dataIndex: 'producto',
            key: 'producto',
            render: (producto, row) => {
              return (
                <p>{producto? producto.nombre : row.nombre_desc}</p>
              );
            }
          },
          {
            title: "Cantidad",
            dataIndex: 'cantidad',
            key: 'cantidad',
            render: (cantidad) => {
              return (
                <p>{cantidad}</p>
              );
            }
          },
          {
            title: "Unidad",
            dataIndex: 'producto',
            key: 'producto',
            render: (producto, row) => {
              return (
                <p>{producto ? producto.unidad.nombre : row.cantidad_desc}</p>
              );
            }
          },
          {
            title: "Total",
            dataIndex: 'total',
            key: 'total',
            render: (total) => {
              return (
                <p>{total}</p>
              );
            }
          },
        ];
        const content = (
          <Table columns={columnas} dataSource={detalle} pagination={false} />
        );
        return(
          <Popover content={content} title="" trigger="click">
            <Button type="primary">Ver +</Button>
          </Popover>
        );
      }
    },
    {
      title: "Comprobante",
      render: (row) => {
        const verPdf = () => {
          console.log(row);
          pedidoService.verPdf().then(({data}) => {
            console.log(data)
          })
        }

        return(
          <Button>
            <a href = {`${process.env.REACT_APP_BASE_PATH}/wiqli/ver-pdf/${row.id}`} target = "_blank">Ver PDF</a>
          </Button>
        );
      }
    },
    {
      title: "Estado",
      dataIndex: "",
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
    const values = form.getFieldsValue();
    console.log(values);
    
    var fieldsValue = values;
    if(values.fecha){
        var fieldsValue = {
        ...values,
        'fechaInicial': values['fecha'][0].format('YYYY-MM-DD'),
        'fechaFinal': values['fecha'][1].format('YYYY-MM-DD')
      };
    }
    // const rangeValue = values['fecha'];
    // values['fecha'][0] = rangeValue[0].format('YYYY-MM-DD');
    // values['fecha'][1] = rangeValue[1].format('YYYY-MM-DD');
    console.log(fieldsValue);
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
    });
  };

  const exportExcel = () => {
    const values = form.getFieldsValue();
    console.log(values)
    if(values.fecha){
      let fechaInicial = values.fecha[0].format('YYYY-MM-DD');
      let fechaFinal = values.fecha[1].format('YYYY-MM-DD');
      pedidoService.getExcel(fechaInicial, fechaFinal).then(({data}) => {
        console.log(data);
      })
    }
    if(!values.fecha){
      pedidoService.getExcelAll().then(({data}) => {
        console.log(data);
      })
    }
  }

  const changeStatusPedido = (id) => {
    pedidoService.updateState(id).then(() => {
      fetchAll(pagination.current);
    });
  }

  return (
    <Page title="Pedidos">
      <Buscar form={form} handleParentSearch={fetchAll} exportExcel={exportExcel} />
      <Card>
        <CardHeader>
          Lista de Pedidos
        </CardHeader>
        <CardBody>
          <Table
            columns={columns}
            rowKey={(record) => record.id}
            dataSource={rows}
            pagination={pagination}
            loading={loading}
            onChange={fetchAll}
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