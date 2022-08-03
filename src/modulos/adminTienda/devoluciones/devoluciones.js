import React, { Fragment, useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import { connect } from "react-redux";
import { Table, Form, Popover, Button, Tooltip, Card as CardAnt, Select, Input, Image } from "antd";
import { TiendaDevolucionService } from "../../../servicios/tienda/tiendaDevolucionService";
import { updateMigas } from "../../../redux/actions/routeActions";
import Buscar from "./buscar";
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { toastr } from "react-redux-toastr";
import Page from '../../../components/Page';
//import columnas from "./columnas";
import "./style.css";

import {
  Card,
  CardBody,
  CardHeader
} from 'reactstrap';

const { Option } = Select;
const Devoluciones = ({ updateMigas }) => {
  const devolucionService = new TiendaDevolucionService("tienda/devoluciones");
  const { url, path } = useRouteMatch();
  const [form] = Form.useForm();

  let columns = [
    {
      title: "Fecha de orden",
      dataIndex: "created_at",
      render: (created_at) => {
        return (
          <p>{created_at.substr(0,10)}</p>
        );
      }
    },
    {
      title: "Fecha delivery",
      dataIndex: "fecha_recojo",
      sorter: true,
      render: (fecha_recojo) => {
        return (
          <p>{fecha_recojo}</p>
        );
      }
    },
    {
      title: "Productos a devolver",
      dataIndex: "producto_gestion",
      render: (producto_gestion, row) => {
        const content = producto_gestion.map((elemento) => 
          <div className="card-imagen-producto-devolucion" key={elemento.id}>
            <CardAnt
              bodyStyle={{ padding: 0}}
              cover={
                <Image
                  src={elemento.producto? elemento.producto.imagen: `${process.env.REACT_APP_BASE_PATH}/myfiles/${elemento.imagen_producto}`}
                  alt={elemento.nombre_producto}
                />
              }
            >
              <div >
                <p style={{ margin: "0px", fontSize: "12px" }}>{elemento.nombre_producto} - {elemento.precio}</p>
              </div>
            </CardAnt> 
          </div>
        )
        const general = <div style={{ display: "flex"}}>
          {content}
        </div>
        return (
          <Popover content={general} title="" trigger="click">
            <Button type="danger" size="small">Ver +</Button>
          </Popover>
        );
      }
    },
    {
      title: "Motivos",
      dataIndex: "producto_gestion",
      render: (producto_gestion) => {
        const content = producto_gestion.map((producto) => (
          <li key={producto.id}>
            <p>{producto.motivo_devolucion.nombre}</p>
          </li>
        ));
        return (
          <ol>
            {content}
          </ol>
        );
      }
    },
    {
      title: "Código",
      dataIndex: "codigo_repo",
      render: (codigo_repo) => {
        return (
          <p>{codigo_repo}</p>
        );
      }
    },
    {
      title: "Monto devolución (S/)",
      dataIndex: "total_devolucion",
      render: (total_devolucion) => {
        return (
          <p>{total_devolucion}</p>
        );
      }
    },
    {
      title: "Cliente",
      dataIndex: "delivery",
      render: (delivery) => {
        return(
          <p>{delivery.nombres} {delivery.apellidos}</p>
        );
      }
    },
    {
      title: "Evidencia del producto",
      dataIndex: "producto_gestion",
      render: (producto_gestion) => {
        const content = producto_gestion.map((elemento) => 
          <div className="card-imagen-producto-devolucion" key={elemento.id}>
            <CardAnt
              bodyStyle={{ padding: 0}}
              cover={
                <Image
                  src={`${process.env.REACT_APP_BASE_PATH}/myfiles/${elemento.imagen_producto}`}
                  alt={elemento.nombre_producto}
                />
              }
            >
              <div >
                <p style={{ margin: "0px", fontSize: "12px" }}>{elemento.nombre_producto}</p>
                <p style={{ margin: "0px", fontSize: "12px" }}>{elemento.comentario_evidencia}</p>
              </div>
            </CardAnt> 
          </div>
        )
        const general = <div style={{ display: "flex"}}>
          {content}
        </div>
        return(
          <Popover content={general} title="" trigger="click">
            <Button type="primary" size="small">Ver Productos</Button>
          </Popover>
        );
      }
    },
    {
      title: "Boleta",
      dataIndex: "producto_gestion",
      render: (producto_gestion) => {
        return(
          <div>
            {producto_gestion.map((elemento) => 
              <Button type="primary" key={elemento.id}>
                <a href = {`${process.env.REACT_APP_BASE_PATH}/myfiles/${elemento.imagen_boleta}`} target = "_blank">Ver</a>
              </Button>
            )}
          </div>
        );
      }
    },
    {
      title: "Estado",
      dataIndex: "tracker_devolucion",
      render: (tracker_devolucion) => {
        return (
          <p>{tracker_devolucion ? tracker_devolucion.nombre_estado : ''}</p>
        );
      }
    },
    {
      title: "Pendiente",
      dataIndex: "tracker_devolucion",
      render: (tracker_devolucion) => {
        const devolverProducto = (valor) => {
          if(valor){
            devolucionService.productoDevuelto(tracker_devolucion.gestion_id, tracker_devolucion.id).then(({data}) => {
              toastr.info(data.message);
              fetchAll();
            });
          }else{
            devolucionService.productoNoDevuelto(tracker_devolucion.gestion_id, tracker_devolucion.id).then(({data}) => {
              toastr.info(data.message);
              fetchAll();
            });
          }
        }

        const devolverDinero = (valor) => {
          devolucionService.devolverDinero(tracker_devolucion.gestion_id, tracker_devolucion.id, valor).then(({data}) => {
            fetchAll();
          });
        }

        const aceptarDevolucion = () => {
          devolucionService.aceptarDevolucion(tracker_devolucion.gestion_id, tracker_devolucion.id).then(({data}) => {
            toastr.info(data.message);
            fetchAll();
          });
        }

        const denegarDevolucion = (values) => {
          devolucionService.denied(tracker_devolucion.gestion_id, values).then((response) => {
            fetchAll();
          });
        }

        const motivo = (
          <Form
            initialValue={{motivo: 'Producto en mal estado'}}
            onFinish={denegarDevolucion}
          >
            <Form.Item 
              name="motivo"
            >
              <Select placeholder="Selecciona un motivo">
                <Option value="Producto en mal estado">Producto en mal estado</Option>
                <Option value="Producto en oferta">Producto en oferta</Option>
                <Option value="Se envió un producto distinto">Se envió un producto distinto</Option>
                <Option value="Otro">Otro(escribir motivo)</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name={"comentario"}
            >
              <Input className="input-padre" placeholder="Escriba un comentario" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Confirmar
              </Button>
            </Form.Item>
          </Form>
        );

        return (
          <>
            {
              tracker_devolucion && 
              <>
              {tracker_devolucion.estado===1 && 
                <p>Operador logístico por confirmar</p>
              }
              {tracker_devolucion.estado===2 && 
                  <p>Producto en camino</p>
              }
              {tracker_devolucion.estado===3 && 
                  <p>Producto Recogido</p>
              }
              {tracker_devolucion.estado===4 && 
                <Fragment>
                  <p>¿Producto devuelto?</p>
                  <Tooltip title="Aceptar">
                    <Button 
                      type="primary" 
                      shape="circle"
                      onClick={() => devolverProducto(true)}
                    >
                      <CheckOutlined />
                    </Button>
                  </Tooltip>
                  <Tooltip title="Denegar">
                    <Button 
                      type="primary" 
                      shape="circle"
                      onClick={() => devolverProducto(false)}
                    >
                      <CloseOutlined />
                    </Button>
                  </Tooltip>
                </Fragment>
              }
              {tracker_devolucion.estado===5 && 
                <Fragment>
                  <p>¿Devolución aceptada?</p>
                  <Tooltip title="Aceptar">
                    <Button 
                      type="primary" 
                      shape="circle"
                      onClick={aceptarDevolucion}
                    >
                      <CheckOutlined />
                    </Button>
                  </Tooltip>
                  <Popover content={motivo} title="" trigger="click">
                    <Button type="primary" shape="circle" >
                      <CloseOutlined />
                    </Button>
                  </Popover>
                </Fragment>
              }
              {tracker_devolucion.estado===6 && 
                <Fragment>
                  <p>¿Dinero devuelto?</p>
                  <Tooltip title="Aceptar">
                    <Button 
                      type="primary" 
                      shape="circle" 
                      onClick={() => devolverDinero({aceptado: true})}
                    >
                      <CheckOutlined />
                    </Button>
                  </Tooltip>
                  <Tooltip title="Denegar">
                    <Button 
                      type="primary" 
                      shape="circle"
                      onClick={() => devolverDinero({aceptado: false})}
                    >
                      <CloseOutlined />
                    </Button>
                  </Tooltip>
                </Fragment>
              }
              {tracker_devolucion.estado===7 && 
                <Fragment>
                  <p>Finalizado</p>
                </Fragment>
              }
              </>
            }
          </>
        );
      }
    }
  ];

  let columnsError = [
    {
      title: "Fecha de orden",
      dataIndex: "created_at",
      render: (created_at) => {
        return (
          <p>{created_at.substr(0,10)}</p>
        );
      }
    },
    {
      title: "Fecha delivery",
      dataIndex: "fecha_recojo",
      sorter: true,
      render: (fecha_recojo) => {
        return (
          <p>{fecha_recojo}</p>
        );
      }
    },
    {
      title: "Productos a devolver",
      dataIndex: "producto_gestion",
      render: (producto_gestion, row) => {
        const content = producto_gestion.map((elemento) => 
          <div className="card-imagen-producto-devolucion" key={elemento.id}>
            <CardAnt
              bodyStyle={{ padding: 0}}
              cover={
                <Image
                  src={elemento.producto? elemento.producto.imagen: `${process.env.REACT_APP_BASE_PATH}/myfiles/${elemento.imagen_producto}`}
                  alt={elemento.nombre_producto}
                />
              }
            >
              <div >
                <p style={{ margin: "0px", fontSize: "12px" }}>{elemento.nombre_producto} - {elemento.precio}</p>
              </div>
            </CardAnt> 
          </div>
        )
        const general = <div style={{ display: "flex"}}>
          {content}
        </div>
        return (
          <Popover content={general} title="" trigger="click">
            <Button type="danger" size="small">Ver +</Button>
          </Popover>
        );
      }
    },
    {
      title: "Motivos",
      dataIndex: "producto_gestion",
      render: (producto_gestion) => {
        const content = producto_gestion.map((producto) => (
          <li key={producto.id}>
            <p>{producto.motivo_devolucion.nombre}</p>
          </li>
        ));
        return (
          <ol>
            {content}
          </ol>
        );
      }
    },
    {
      title: "Código",
      dataIndex: "codigo_repo",
      render: (codigo_repo) => {
        return (
          <p>{codigo_repo}</p>
        );
      }
    },
    {
      title: "Monto devolución (S/)",
      dataIndex: "total_devolucion",
      render: (total_devolucion) => {
        return (
          <p>{total_devolucion}</p>
        );
      }
    },
    {
      title: "Cliente",
      dataIndex: "delivery",
      render: (delivery) => {
        return(
          <p>{delivery? delivery.nombres + ' ' + delivery.apellidos : ''}</p>
        );
      }
    },
    {
      title: "Evidencia del producto",
      dataIndex: "producto_gestion",
      render: (producto_gestion) => {
        const content = producto_gestion.map((elemento) => 
          <div className="card-imagen-producto-devolucion" key={elemento.id}>
            <CardAnt
              bodyStyle={{ padding: 0}}
              cover={
                <Image
                  src={`${process.env.REACT_APP_BASE_PATH}/myfiles/${elemento.imagen_producto}`}
                  alt={elemento.nombre_producto}
                />
              }
            >
              <div >
                <p style={{ margin: "0px", fontSize: "12px" }}>{elemento.nombre_producto}</p>
                <p style={{ margin: "0px", fontSize: "12px" }}>{elemento.comentario_evidencia}</p>
              </div>
            </CardAnt> 
          </div>
        )
        const general = <div style={{ display: "flex"}}>
          {content}
        </div>
        return(
          <Popover content={general} title="" trigger="click">
            <Button type="primary" size="small">Ver +</Button>
          </Popover>
        );
      }
    },
    {
      title: "Boleta",
      dataIndex: "producto_gestion",
      render: (producto_gestion) => {
        return(
          <div>
            {producto_gestion.map((elemento) => 
              <Button type="primary" key={elemento.id} size="small">
                <a href = {`${process.env.REACT_APP_BASE_PATH}/myfiles/${elemento.imagen_boleta}`} target = "_blank">Ver +</a>
              </Button>
            )}
          </div>
        );
      }
    },
    {
      title: "Pendiente",
      dataIndex: "id",
      render: (id) => {
        const Aceptar = () => {
          devolucionService.aceptarDevolucionErrorTienda(id).then((data) => {
            fetchAll();
            fetchAllByError();
          })
        }
        const Denegar = () => {
          devolucionService.denegarDevolucionErrorTienda(id).then((data) => {
            fetchAll();
            fetchAllByError();
          })
        }

        return (
          <Fragment>
            <p>¿Se aceptará el pago del delivery?</p>
            <Tooltip title="Aceptar">
              <Button type="primary" shape="circle" onClick={Aceptar} ><CheckOutlined /></Button>
            </Tooltip>
            <Tooltip title="Denegar">
              <Button type="primary" shape="circle" onClick={Denegar} ><CloseOutlined /></Button>
            </Tooltip>
          </Fragment>
        );
      }
    }
  ];

  const [rows, setRows] = useState([]);
  const [rowsError, setRowsError] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
  });
  const [paginationError, setPaginationError] = useState({
    current: 1,
    pageSize: 2,
    total: 0,
  });
  const [loading] = useState(false);

  const fetchAll = (paginationTab = pagination) => {
    const values = form.getFieldsValue();
    const searchObj = {
      ...values,
      page: paginationTab? paginationTab.current : 1
    }

    devolucionService.getAll(searchObj).then(({ data }) => {
      setPagination({
        ...paginationTab,
        current: data.current,
        total: data.total,
      });
      setRows(data.data);
    });
  };

  const fetchAllByError = (paginationTab = paginationError) => {
    const values = form.getFieldsValue();
    const searchObj = {
      ...values,
      page: paginationTab? paginationTab.current : 1
    }

    devolucionService.getAllErrors().then(({ data }) => {
      setPaginationError({
        ...paginationTab,
        current: data.current,
        total: data.total,
      });
      setRowsError(data.data);
    });
  };

  useEffect(() => {
    updateMigas(url);
    if (!rows.length) {
      fetchAll();
    }
    if (!rowsError.length) {
      fetchAllByError();
    }
  }, []);

  return (
    <Page title="Devoluciones">
      <Buscar form={form} handleParentSearch={fetchAll}/>
        {
          rowsError.length>0 &&
          <Card style={{marginBottom: "15px"}}>
            <CardHeader style={{color: "red"}}>Lista de devoluciones por confirmar</CardHeader>
            <CardBody>
              <Table
                columns={columnsError}
                rowKey={(record) => record.id}
                dataSource={rowsError}
                pagination={paginationError}
                loading={loading}
                onChange={fetchAllByError}
                scroll={{x : 1800}}
              />
            </CardBody>
          </Card>
        }
        <Card>
          <CardHeader>
            Lista de devoluciones
          </CardHeader>
          <CardBody>
            <Table
              columns={columns}
              rowKey={(record) => record.id}
              dataSource={rows}
              pagination={pagination}
              loading={loading}
              onChange={fetchAll}
              scroll={{ x: 2200 }}
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

export default connect(mapStateToProps, mapDispatchToProps)(Devoluciones);