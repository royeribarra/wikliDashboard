import React, { Fragment } from "react";
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Table, Form, Popover, Button, Tooltip, Select, Input, Row, Col, Image } from "antd";

import { TiendaDevolucionService } from "../../../servicios/tienda/tiendaDevolucionService";
const { Option } = Select;
const devolucionService = new TiendaDevolucionService("tienda/devoluciones");

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

export default columns = [
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
    sorter: true
  },
  {
    title: "Productos a devolver",
    dataIndex: "producto_gestion",
    render: (producto_gestion, row) => {
      const content = producto_gestion.map((elemento) => 
        <div className="card-imagen-producto-devolucion" key={elemento.id}>
          <Card
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
          </Card> 
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
  },
  {
    title: "Monto Devolución",
    dataIndex: "total_devolucion",
    render: (total_devolucion) => {
      return (
        <p>S/. {total_devolucion}</p>
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
    title: "Evidencia del Producto",
    dataIndex: "producto_gestion",
    render: (producto_gestion) => {
      const content = producto_gestion.map((elemento) => 
        <div className="card-imagen-producto-devolucion" key={elemento.id}>
          <Card
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
          </Card> 
        </div>
      )
      const general = <div style={{ display: "flex"}}>
        {content}
      </div>
      return(
        <Popover content={general} title="" trigger="click">
          <Button type="primary" shape="small">Ver Productos</Button>
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