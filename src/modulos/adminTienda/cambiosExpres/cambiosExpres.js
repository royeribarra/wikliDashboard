import React, { Fragment, useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import { connect } from "react-redux";
import { Table, Form, Card as CardAnt, Popover, Button, Select, Input, Tooltip, Image } from "antd";
import { TiendaCambioExpresService } from "../../../servicios/tienda/tiendaCambioExpresService";
import { updateMigas } from "../../../redux/actions/routeActions";
import Buscar from "./buscar";
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import "./tabla_style.css";
import Page from '../../../components/Page';
import {
  Card,
  CardBody,
  CardHeader
} from 'reactstrap';

const { Option } = Select;

const CambiosExpres = ({ updateMigas }) => {
  const cambioService = new TiendaCambioExpresService("tienda/cambios-expres");
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
          <div className="card-imagen-producto-devolucion">
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
      title: "Precio (S/)",
      dataIndex: "total_productos_gestion",
      render: (total_productos_gestion) => {
        return (
          <p>{total_productos_gestion}</p>
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
      title: "Productos nuevos",
      dataIndex: "nuevos_productos",
      render: (nuevos_productos) => {
        const content = nuevos_productos.map((producto) => 
          <div className="card-imagen-producto-devolucion">
            <CardAnt
              bodyStyle={{ padding: 0}}
              cover={
                <Image
                  alt={producto.producto? producto.producto.name: ''} 
                  src={producto.producto? producto.producto.image: ''}
                />
              }
            >
              <div >
                {
                  producto.producto && 
                  <p style={{ margin: 0, textAlign: "left", fontSize: 12}}>
                    {producto.producto.name} -
                    {producto.producto.sku} -
                    {producto.producto.talla} -
                    {producto.producto.color} -
                    S/. {producto.producto.sale_price}
                  </p>
                }
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
      title: "Cobro Neto (S/)",
      dataIndex: "cobro_neto",
      render: (cobro_neto) => {
        return (
          <p>{cobro_neto}</p>
        );
      }
    },
    {
      title: "Evidencia del producto",
      dataIndex: "producto_gestion",
      render: (producto_gestion) => {
        const content = producto_gestion.map((elemento) => 
          <div className="card-imagen-producto-devolucion">
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
      title: "Estado",
      dataIndex: "tracker_cambio_deluxe",
      render: (tracker_cambio_deluxe) => {
        return (
          <p>{tracker_cambio_deluxe? tracker_cambio_deluxe.nombre_estado : ''}</p>
        );
      }
    },
    {
      title: "Pendiente",
      dataIndex: "tracker_cambio_deluxe",
      render: (tracker_cambio_deluxe) => {
        const updateTracker = () => {
          cambioService.updateStateFromStore(tracker_cambio_deluxe.gestion_id, tracker_cambio_deluxe).then((response) => {
            fetchAll();
          });
        }

        const denegarDevolucion = (values) => {
          cambioService.denied(tracker_cambio_deluxe.gestion_id, values).then((response) => {
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
            tracker_cambio_deluxe && 
            <>
              {tracker_cambio_deluxe.estado===1 && 
                <Fragment>
                  <p>Operador logístico por confirmar (RECOJO).</p>
                </Fragment>
              }
              {tracker_cambio_deluxe.estado===2 && 
                <Fragment>
                  <p>Operador logístico en camino a "RECOJO".</p>
                </Fragment>
              }
              {tracker_cambio_deluxe.estado===3 && 
                <Fragment>
                  <p>"RECOJO" productos a cambiar.</p>
                </Fragment>
              }
              {tracker_cambio_deluxe.estado===4 && 
                <Fragment>
                  <p>¿Producto devuelto a tienda?</p>
                  <Tooltip title="Aceptar">
                    <Button 
                      type="primary" 
                      shape="circle"
                      onClick={() => updateTracker(tracker_cambio_deluxe)} 
                    >
                      <CheckOutlined />
                    </Button>
                  </Tooltip>
                  <Tooltip title="Denegar">
                    <Button type="primary" shape="circle">
                      <CloseOutlined />
                    </Button>
                  </Tooltip>
                </Fragment>
              }
              {tracker_cambio_deluxe.estado===5 && 
                <Fragment>
                  <p>Producto nuevo en camino</p>
                </Fragment>
              }
              {tracker_cambio_deluxe.estado===6 && 
                <Fragment>
                  <p>Producto nuevo entregado</p>
                </Fragment>
              }
              {tracker_cambio_deluxe.estado===7 && 
                <Fragment>
                  <p>¿Cambio aceptado?</p>
                  <Tooltip title="Aceptar">
                    <Button 
                      type="primary" 
                      shape="circle"
                      onClick={() => updateTracker(tracker_cambio_deluxe)} 
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
              {tracker_cambio_deluxe.estado===8 && 
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
          <div className="card-imagen-producto-devolucion">
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
      title: "Precio (S/)",
      dataIndex: "total_pago",
      width: 150,
      render: (total_pago) => {
        return (
          <p>{total_pago}</p>
        );
      }
    },
    {
      title: "Cliente",
      dataIndex: "delivery",
      width: 130,
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
          <div className="card-imagen-producto-devolucion">
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
      title: "Pendiente",
      dataIndex: "id",
      render: (id) => {
        const Aceptar = () => {
          cambioService.aceptarCambioErrorTienda(id).then((data) => {
            fetchAll();
            fetchAllByError();
          })
        }
        const Denegar = () => {
          cambioService.denegarCambioErrorTienda(id).then((data) => {
            fetchAll();
            fetchAllByError();
          })
        }
        return (
          <Fragment>
            <p>¿Se aceptará el pago del delivery?</p>
            <Tooltip title="Aceptar">
              <Button type="primary" shape="circle" icon={<CheckOutlined />} onClick={Aceptar} />
            </Tooltip>
            <Tooltip title="Denegar">
              <Button type="primary" shape="circle" icon={<CloseOutlined />} onClick={Denegar} />
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

    cambioService.getAll(searchObj).then(({ data }) => {
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

    cambioService.getAllErrors().then(({ data }) => {
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
    <Page title="Cambios Express">
      <Buscar form={form} handleParentSearch={fetchAll}/>
      {
        rowsError.length>0 &&
        <Card style={{marginBottom: "15px"}}>
          <CardHeader style={{color: "red"}}>
            Lista de Cambios express (por aprobar)
          </CardHeader>
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
          Lista de cambios Express
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

export default connect(mapStateToProps, mapDispatchToProps)(CambiosExpres);