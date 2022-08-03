import React, { Fragment, useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import { connect } from "react-redux";
import { Table, Form, Row, Card as CardAnt, Popover, Button } from "antd";
import { TuRepoService } from "../../../servicios/tuRepo/tuRepoService";
import { updateMigas } from "../../../redux/actions/routeActions";
import Buscar from "./buscar";
import Page from 'components/Page';
import { Card, CardBody, CardHeader } from 'reactstrap';

const TuRepo = ({ updateMigas }) => {
  const repoService = new TuRepoService("tu-repo/servicios");
  const { url, path } = useRouteMatch();
  const [form] = Form.useForm();

  let columns = [
    {
      title: "Código",
      dataIndex: "codigo",
      render: (codigo) => {
        return(
          <p>{codigo}</p>
        );
      }
    },
    {
      title: "Nombre del producto",
      dataIndex: "producto",
      sorter: true,
      render: (producto) => {
        return(
          <p>{producto}</p>
        );
      }
    },
    {
      title: "Datos del usuario",
      dataIndex: "delivery",
      render: (delivery) => {
        const content = 
          <Row>
            <CardAnt
              style={{ width: 180, borderRadius: 0, marginBottom: 0}}
              bodyStyle={{ margin: 0, padding: 0, textAlign: "center", fontSize: 14}}
            >
              <p style={{ margin: 0}}>
              {delivery? delivery.nombres + ' ' + delivery.apellidos : ''} 
              </p>
              <p style={{ margin: 0}}>DNI: 
              {delivery? ' ' + delivery.dni : ''} 
              </p>
              <p style={{ margin: 0}}>CEL: 
              {delivery? ' ' + delivery.celular : ''} 
              </p>
              <p style={{ margin: 0}}>
              {delivery? delivery.direccion_recojo : ''} 
              </p>
            </CardAnt>
          </Row>;
        return (
          <Popover content={content} title="" trigger="click">
            <Button type="danger" size="small">Ver +</Button>
          </Popover>
        );
      }
    },
    {
      title: "Tienda",
      dataIndex: "tienda",
      render: (tienda, row) => 
      {
        let nombreTienda = (row.tienda_id === 9 ? row.nombre_tienda : tienda.business_name);
        return (
          <p>
            {nombreTienda}
          </p>
        );
      },
    },
    {
      title: "Boleta",
      dataIndex: "imagen_boleta",
      render: (imagen_boleta) => 
      {
        return (
          <Button type="primary" size="small">
            <a href = {`${process.env.REACT_APP_BASE_PATH}/tuRepo/${imagen_boleta}`} target = "_blank">Ver +</a>
          </Button>
        );
      },
    },
    {
      title: "Opciones",
      dataIndex: "opciones",
      render: (opciones, row) => 
      {
        const content = opciones.map((opcion, index) => 
          <p key={index}>{(index + 1) + '. '} {opcion.opcion_id === 6 ? (opcion.opcion.nombre + '-' + row.nueva_talla) : opcion.opcion.nombre}</p>
        );
        return (
          <Popover content={content} title="" trigger="click">
            <Button type="danger" size="small">Ver +</Button>
          </Popover>
        );
      },
    },
    {
      title: "Fecha de recojo",
      dataIndex: "delivery",
      render: (delivery) => {
        return (
          <p>{delivery ? delivery.fecha_recojo.substr(0, 10): ''}</p>
        );
      },
    },
    {
      title: "Precio de producto (S/)",
      dataIndex: "precio",
      render: (precio) => {
        return(
          <p>{precio}</p>
        );
      }
    },
    {
      title: "Motivo",
      dataIndex: "motivo",
      render: (motivo) => 
      {
        return (
          <>
            {
              motivo === "1" && <p>No me quedó bien</p>
            }
            {
              motivo === "2" && <p>No era lo que esperaba</p>
            }
            {
              motivo === "3" && <p>Pedí otro producto por error</p>
            }
            {
              motivo === "4" && <p>Me entregaron otro producto</p>
            }
            {
              motivo === "5" && <p>Producto dañado</p>
            }
          </>
        );
      },
    },
    {
      title: "Estado",
      dataIndex: "estado",
      render: (estado, row) => {
        const { id } = row;
        return (
          <Fragment>
            {estado === 1 && (
              <Button
                className="boton boton--verde boton-estado text-center"
                type="primary"
                onClick={() => {
                  changeStatusUsers(id, estado);
                }}
              >
                Recibido
              </Button>
            )} 
            {estado === 2 && (
              <Button
                className="boton boton--verde boton-estado text-center"
                type="primary"
                onClick={() => {
                  changeStatusUsers(id, estado);
                }}
              >
                Iniciado
              </Button>
            )}
            {estado === 3 && (
              <Button
                className="boton boton--verde boton-estado text-right"
                type="primary"
              >
                Finalizado
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

  const changeStatusUsers = (id, state) => {
    const dataChangeStatus = {
      id,
      state,
    };

    repoService.changeStatus(dataChangeStatus).then(() => {
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

    repoService.getAll(searchObj).then(({ data }) => {
      setPagination({
        ...paginationTab,
        current: data.current,
        total: data.total,
      });
      setRows(data.data);
    });
  };

  return (
    <Page title="Procesos de Tu Repo">
      <Buscar form={form} handleParentSearch={fetchAll}/>
      <Card>
        <Card>
          <CardHeader>
            Lista de servicios
          </CardHeader>
          <CardBody>
            <Table
              columns={columns}
              rowKey={(record) => record.id}
              dataSource={rows}
              pagination={pagination}
              loading={loading}
              onChange={fetchAll}
              scroll={{ x: 1600}}
            />
          </CardBody>
        </Card>
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

export default connect(mapStateToProps, mapDispatchToProps)(TuRepo);