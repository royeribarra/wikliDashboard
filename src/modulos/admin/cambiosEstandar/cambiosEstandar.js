import Page from 'components/Page';
import React, { useState, useEffect } from 'react';
import { useRouteMatch } from "react-router-dom";
import { RepoCambioEstandarService } from "../../../servicios/admin/repoCambioEstandarService";
import { RepoOperadorLogisticoService } from "../../../servicios/admin/repoOperadorLogisticoService";
import { ConfiguracionService } from "../../../servicios/tienda/configuracionService";
import { CardBody, CardHeader } from 'reactstrap';
import { Table, Form, Space, Popover, Button, Card, Image, DatePicker } from "antd";
import moment from 'moment';
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import Buscar from './buscar';
import "./style.css";

const tableTypes = ['', 'bordered', 'striped', 'hover'];

const CambiosEstandar = () => {
  const cambioService = new RepoCambioEstandarService("repo/cambios-estandar");
  const logisticoService = new RepoOperadorLogisticoService("repo/operadores-logisticos");
  const configuracionService = new ConfiguracionService("configuracion");
  const { url } = useRouteMatch();
  const [form] = Form.useForm();
  const [carriers, setCarriers] = useState([]);
  const [configuracion, setConfiguracion] = useState();
  const [dia, setDia] = useState();
  const [nuevaFecha, setNuevaFecha] = useState(moment());

  const disabledDate = (current) => {
    let lunes = configuracion.dias_atencion.lunes,
      martes = configuracion.dias_atencion.martes,
      miercoles = configuracion.dias_atencion.miercoles,
      jueves = configuracion.dias_atencion.jueves,
      viernes = configuracion.dias_atencion.viernes,
      sabado = configuracion.dias_atencion.sabado,
      domingo = configuracion.dias_atencion.domingo;
    var expresion_general = '';
      if(!lunes){
        expresion_general = expresion_general.concat('|| current.day() === 1')
      }
      if(!martes){
        expresion_general = expresion_general.concat('|| current.day() === 2')
      }
      if(!miercoles){
        expresion_general = expresion_general.concat('|| current.day() === 3')
      }
      if(!jueves){
        expresion_general = expresion_general.concat('|| current.day() === 4')
      }
      if(!viernes){
        expresion_general = expresion_general.concat('|| current.day() === 5')
      }
      if(!sabado){
        expresion_general = expresion_general.concat('|| current.day() === 6')
      }
      if(!domingo){
        expresion_general = expresion_general.concat('|| current.day() === 0')
      }
    let prueba = (!lunes? current.day() === 1 : '') || (!martes? current.day() === 2 : '') || (!miercoles? current.day() === 3 : '') || (!jueves? current.day() === 4 : '') || (!viernes? current.day() === 5 : '') || (!sabado? current.day() === 6 : '') || (!domingo? current.day() === 0 : '');
    return prueba;
      
  }

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
    if (!rows.length) {
      fetchAll();
    }
  }, []);

  const getConfiguracion = (tienda_id) => {
    configuracionService.getByTienda(tienda_id).then(({data}) => {
      setConfiguracion(data);
    });
  }

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
      dataIndex: "tracker_cambio_estandar",
      sorter: true,
      key: 'tramo',
      render: (tracker_cambio_estandar) => {
        return(
          <>
            {
              tracker_cambio_estandar &&
              <p>{tracker_cambio_estandar.estado < 5 ? 'Recojo' : 'Entrega'}</p>
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
          <p>{delivery? delivery.direccion + '-' + delivery.referencia: ''}</p>
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
      dataIndex: "tracker_cambio_estandar",
      render: (tracker_cambio_estandar) => {
        return (
          <p>{tracker_cambio_estandar? tracker_cambio_estandar.nombre_estado : ''}</p>
        );
      }
    },
    {
      title: "Carrier",
      dataIndex: "tracker_cambio_estandar",
      render: (tracker_cambio_estandar, row) => {
        const mostrarCarriers = () => {
          getConfiguracion(row.tienda_id);
          //setNuevaFecha(moment().format('YYYY-MM-DD'));
          setNuevaFecha(row.fecha_recojo);
          logisticoService.getCarriers(row.id).then(({data}) => {
            setCarriers(data.carriers);
            setDia(data.dia);
          });
        }
        const seleccionar = (carrier) => {
          if(carrier.id === 3){
            cambioService.createWayBill(row.id, carrier.id, {'fecha': nuevaFecha}).then(({data}) => {
              if(data.state){
                //toastr.success(data.message);
              }else{
                //toastr.warning(data.message);
              }
            });
          }else{
            cambioService.createWayBill2(row.id, carrier, carrier.id).then(({data}) => {
              //toastr.success(data.message);
              cambioService.generateCarrierWayBill(row.id, data, carrier).then(({data}) => {
                //toastr.success(data.message);
                fetchAll();
              })
            });
          }
        }
        const onChange = (date, dateString) => {
          setNuevaFecha(dateString);
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
            title: "Fecha",
            dataIndex: '',
            key: '',
            render: () => {
              return (
                <DatePicker 
                  onChange={onChange} 
                  defaultValue={
                    tracker_cambio_estandar ? (tracker_cambio_estandar.estado < 5 ? moment(row.fecha_recojo) : moment().add(1, 'd')) : moment()
                  }
                  disabledDate={disabledDate}
                />
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
              tracker_cambio_estandar &&
              <>
                {
                  (tracker_cambio_estandar.estado === 1 || tracker_cambio_estandar.estado === 6) && 
                  <Popover content={content} title="" trigger="click">
                    <Button type="primary" onClick={ mostrarCarriers }>Elegir +</Button>
                  </Popover>
                }
              </>
            }
            {
              tracker_cambio_estandar &&
              <>
                {(tracker_cambio_estandar.estado !== 1 && tracker_cambio_estandar.estado !== 6) &&
                <p>El carrier ya fue seleccionado.</p>}
              </>
            }
            {
              !tracker_cambio_estandar &&
              <p style={{ color: "red" }}>No existe tracker</p>
            }
          </>
        );
      }
    }
  ];

  return (
    <Page title="Cambios Estándar">
      <Buscar form={form} handleParentSearch={fetchAll}/>
      <Card>
        <CardHeader>
          Lista de Cambios Estándar
        </CardHeader>
        <CardBody>
          <Table
            columns={columns}
            rowKey={(record) => record.id}
            dataSource={rows}
            pagination={pagination}
            loading={loading}
            onChange={fetchAll}
            scroll={{ x: 3000}}
          />
        </CardBody>
      </Card>
    </Page>
  );
};

export default CambiosEstandar;