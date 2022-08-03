import React, { useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import { connect } from "react-redux";
import { Table, Form, Card, Popover, Button, Tag, Row, Col } from "antd";
import { ProcesosFinalizadosService } from "../../../servicios/tienda/procesosFinalizadosService";
import { updateMigas } from "../../../redux/actions/routeActions";
import Buscar from "./buscar";
import { CardBody, CardHeader } from "reactstrap";
import Page from 'components/Page';

const ProcesosFinalizados = ({ updateMigas }) => {
  const service = new ProcesosFinalizadosService("repo/procesos-finalizados");
  const { url, path } = useRouteMatch();
  const [form] = Form.useForm();

  let columns = [
    {
      title: "Tienda",
      dataIndex: "tienda",
      render: (tienda) => {
        return (
          <p>{tienda.business_name}</p>
        );
      }
    },
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
      title: "Fecha recojo",
      dataIndex: "fecha_recojo",
      sorter: true,
      render: (fecha_recojo) => {
        return (
          <p>{fecha_recojo}</p>
        );
      }
    },
    {
      title: "Tipo",
      dataIndex: "tipo_servicio",
      render: (tipo_servicio) => {
        let tipo, color;
        switch(tipo_servicio) {
          case 1:
            tipo = 'Estándar';
            color = 'green';
            break;
          case 2:
            tipo = 'Deluxe';
            color = 'purple'
            break;
          case 3:
            tipo = 'Devolución';
            color = 'magenta'
            break;
          default:
        }
        return(
          <Tag color={color} key={tipo_servicio}>
            { tipo }
          </Tag>
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
      title: "Productos",
      dataIndex: "producto_gestion",
      render: (producto_gestion) => {
        const content = 
          <Row>
            {producto_gestion.map((producto) => (
              <Col>
                <Card
                  style={{ width: 180, borderRadius: 0, marginBottom: 0}}
                  bodyStyle={{ margin: 0, padding: 0}}
                  cover={
                    <img 
                      alt={producto.nombre_producto} 
                      src={producto.producto? producto.producto.imagen: ''}
                    />}
                >
                  <p style={{ margin: 0, textAlign: "left", fontSize: 14}}>
                    {producto.nombre_producto} {producto.precio}
                  </p>
                </Card>
              </Col>
            ))}
          </Row>;
        return (
          <Popover content={content} title="" trigger="click">
            <Button type="danger" size="small">Ver +</Button>
          </Popover>
        );
      }
    },
    {
      title: "Precio (S/)",
      width: 125,
      dataIndex: "total_productos_gestion",
      render: (total_productos_gestion) => {
        return (
          <p>{total_productos_gestion}</p>
        );
      }
    },
    {
      title: "Producto nuevo",
      dataIndex: "nuevos_productos",
      render: (nuevos_productos, row) => {
        const content = 
          <Row>
            {nuevos_productos.map((producto) => (
              <Col>
                <Card
                  style={{ width: 180, borderRadius: 0, marginBottom: 0}}
                  bodyStyle={{ margin: 0, padding: 0}}
                  cover={
                    <img 
                      alt={producto.producto? producto.producto.name: ''} 
                      src={producto.producto? producto.producto.image: ''}
                    />}
                >
                  {
                    producto.producto && 
                    <p style={{ margin: 0, textAlign: "left", fontSize: 14}}>
                      {producto.producto.name} -
                      {producto.producto.sku} -
                      {producto.producto.talla} -
                      {producto.producto.marca} -
                      S/. {producto.producto.price}
                    </p>
                  }
                </Card>
              </Col>
            ))}
          </Row>;
        return (
          <>
            {row.tipo_servicio === 3 && <p>No aplica</p>}
            {row.tipo_servicio !== 3 && 
            <Popover content={content} title="Nuevos Productos" trigger="click">
              <Button type="danger" size="small">Ver +</Button>
            </Popover>}
          </>
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
      title: "Cobro neto (S/)",
      dataIndex: "cobro_neto",
      render: (cobro_neto) => {
        return(
          <p>{cobro_neto}</p>
        );
      }
    },
    {
      title: "Cobro logístico (S/)",
      dataIndex: "costo_logistico",
      render: (costo_logistico) => {
        return(
          <p>{costo_logistico}</p>
        );
      }
    },
  ];

  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
  });
  const [loading] = useState(false);

  const fetchAll = (paginationTab = pagination) => {
    const values = form.getFieldsValue();
    const searchObj = {
      ...values,
      page: paginationTab? paginationTab.current : 1
    }

    service.getAll(searchObj).then(({ data }) => {
      setPagination({
        ...paginationTab,
        current: data.current,
        total: data.total,
      });
      setRows(data.data);
    });
  };

  useEffect(() => {
    updateMigas(url);
    if (!rows.length) {
      fetchAll();
    }
  }, []);

  return (
    <Page title="Procesos Finalizados">
      <Buscar form={form} handleParentSearch={fetchAll}/>
      <Card>
        <CardHeader>
          Lista de procesos finalizados
        </CardHeader>
        <CardBody>
          <Table
            columns={columns}
            rowKey={(record) => record.id}
            dataSource={rows}
            pagination={pagination}
            loading={loading}
            onChange={fetchAll}
            scroll={{ x: 2000}}
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

export default connect(mapStateToProps, mapDispatchToProps)(ProcesosFinalizados);