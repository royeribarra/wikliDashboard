import React, { useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import { connect } from "react-redux";
import { Table, Form, Space, Popover, Button, Card, Image } from "antd";
import { RepoCambioExpresService } from "../../../servicios/admin/repoCambioExpresService";
import { RepoOperadorLogisticoService } from "../../../servicios/admin/repoOperadorLogisticoService";
import { updateMigas } from "../../../redux/actions/routeActions";
import Buscar from "./buscar";
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import { toastr } from "react-redux-toastr";
import { CardBody, CardHeader } from "reactstrap";
import Page from 'components/Page';
import "./style.css";

const CambiosExpres = ({ updateMigas }) => {
  const cambioService = new RepoCambioExpresService("repo/cambios-expres");
  const logisticoService = new RepoOperadorLogisticoService("repo/operadores-logisticos");
  const { url } = useRouteMatch();
  const [form] = Form.useForm();
  const [carriers, setCarriers] = useState([]);
  const [dia, setDia] = useState();
  
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
      title: "Tienda",
      dataIndex: "tienda",
      sorter: true,
      render: (tienda) => {
        return(
          <p>{tienda.business_name}</p>
        );
      }
    },
    {
      title: "Código",
      dataIndex: "codigo_repo",
      render: (codigo_repo) => {
        return(
          <p>{codigo_repo}</p>
        );
      }
    },
    {
      title: "Productos a devolver",
      dataIndex: "producto_gestion",
      render: (producto_gestion) => {
        const content = producto_gestion.map((producto) => (
          <li key={producto.id}>
            {producto.nombre_producto}
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
      title: "Tramo",
      dataIndex: "estado",
      sorter: true,
      key: 'tramo',
      render: (estado) => {
        return(
          <>
            {
              (estado < 5) && <p>Recojo</p>
            }
            {
              (estado >= 6) && <p>Entrega</p>
            }
          </>
        );
      }
    },
    {
      title: "Fecha delivery",
      dataIndex: "fecha_recojo",
      render: (fecha_recojo) => {
        return(
          <p>{fecha_recojo}</p>
        );
      }
    },
    {
      title: "Precio (S/)",
      dataIndex: "total_pago",
      render: (total_pago) => {
        return(
          <p>{total_pago}</p>
        );
      }
    },
    {
      title: "Cliente",
      dataIndex: "delivery",
      render: (delivery) => {
        return(
          <p>{delivery? delivery.nombres + ' ' +delivery.apellidos : ''}</p>
        );
      }
    },
    {
      title: "Celular",
      dataIndex: "delivery",
      render: (delivery) => {
        return(
          <p>{delivery? delivery.celular : ''}</p>
        );
      }
    },
    {
      title: "Dirección",
      dataIndex: "delivery",
      render: (delivery) => {
        return(
          <p>{delivery? delivery.direccion + '-' + delivery.referencia : ''}</p>
        );
      }
    },
    {
      title: "Productos nuevos",
      dataIndex: "nuevos_productos",
      width: 100,
      render: (nuevos_productos) => {
        const content = nuevos_productos.map((producto) => 
          <div className="card-imagen-producto-devolucion">
            <Card
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
                    S/. {producto.producto.price}
                  </p>
                }
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
      title: "Estado",
      dataIndex: "tracker_cambio_deluxe",
      render: (tracker_cambio_deluxe) => {
        return (
          <p>{tracker_cambio_deluxe? tracker_cambio_deluxe.nombre_estado : ''}</p>
        );
      }
    },
    {
      title: "Carrier",
      dataIndex: "id",
      render: (id, row) => {
        const mostrarCarriers = () => {
          logisticoService.getCarriers(id).then(({data}) => {
            setCarriers(data.carriers);
            setDia(data.dia);
          });
        }
        const seleccionar = (carrier) => {
          if(carrier.id === 3){
            cambioService.crearServicioLogisticoRecojo(id, carrier.id).then(({data})=> {
              if(data.state){
                toastr.success(data.message);
                cambioService.crearServicioLogisticoEntrega(id, carrier.id).then(({data})=> {
                  if(data.state){
                    toastr.success(data.message);
                  }else{
                    toastr.error(data.message);
                  }
                })
              }else{
                toastr.error(data.message);
              }
            })
          }else{
            cambioService.createWayBill(id, carrier).then(({data}) => {
              toastr.success(data.message);
              if(data.state){
                cambioService.createWayBill2(id, carrier).then((resp) => {
                  toastr.success(resp.data.message);
                    fetchAll();
                });
              }
            });
          }      
        }
        const columns = [
          {
            title: "Nombre",
            dataIndex: 'nombre',
            key: 'nombre',
            render: text => <p>{text}</p>
          },
          {
            title: "Precio",
            dataIndex: 'tarifas',
            key: 'tarifa_precio',
            render: (tarifas) => {
              return (
                <p>{tarifas[0].precio}</p>
              );
            }
          },
          {
            title: "Hora",
            dataIndex: 'tarifas',
            key: 'tarifa_hora_recojo',
            render: (tarifas) => {
              return (
                <>
                  {
                    dia === '0' && <p>{tarifas[0].hora_recojo_d}</p>
                  }
                  {
                    dia === '6' && <p>{tarifas[0].hora_recojo_s}</p>
                  }
                  {
                    dia !== '0' && dia !== '6' && <p>{tarifas[0].hora_recojo_l_v}</p>
                  }
                </>
              );
            }
          },
          {
            title: "Seleccionar",
            key: 'action',
            render: (carrier) => (
              <Space size="middle">
                <Button onClick={() => seleccionar(carrier)}><CheckCircleTwoTone twoToneColor="#52c41a" /></Button>
                <Button><CloseCircleTwoTone twoToneColor="#E53A32" /></Button>
              </Space>
            ),
          },
        ];
        const content = (
          <Table columns={columns} dataSource={carriers} pagination={false} />
        );
        return (
          <>
            {
              (row.estado === 1) && 
                <Popover content={content} title="" trigger="click">
                  <Button type="primary" onClick={mostrarCarriers}>Elegir +</Button>
                </Popover>
            }
            {
              (row.estado !== 1) &&
              <p>El carrier ya fue seleccionado.</p>
            }
          </>
        );
      }
    }
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

    cambioService.getAll(searchObj).then(({ data }) => {
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
    <Page title="Cambios Express">
      <Buscar form={form} handleParentSearch={fetchAll}/>
      <Card>
        <CardHeader>
          Lista de Cambios Express
        </CardHeader>
        <CardBody>
          <Table
            columns={columns}
            rowKey={(record) => record.id}
            dataSource={rows}
            pagination={pagination}
            loading={loading}
            onChange={fetchAll}
            scroll={{ x: 2600}}
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