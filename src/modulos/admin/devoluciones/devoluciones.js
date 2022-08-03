import React, { useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import { connect } from "react-redux";
import { Table, Form, Space, Popover, Button } from "antd";
import { RepoDevolucionService } from "../../../servicios/admin/repoDevolucionService";
import { RepoOperadorLogisticoService } from "../../../servicios/admin/repoOperadorLogisticoService";
import { updateMigas } from "../../../redux/actions/routeActions";
import Buscar from "./buscar";
import { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons';
import { toastr } from "react-redux-toastr";
import Page from '../../../components/Page';

import {
  Card,
  CardBody,
  CardHeader
} from 'reactstrap';

const Devoluciones = ({ updateMigas }) => {
  const devolucionService = new RepoDevolucionService("repo/devoluciones");
  const logisticoService = new RepoOperadorLogisticoService("repo/operadores-logisticos");
  const { url, path } = useRouteMatch();
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
            <p>
              {producto.motivo_devolucion.nombre}
            </p>
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
      title: "Estado",
      dataIndex: "tracker_devolucion",
      render: (tracker_devolucion) => {
        return (
          <p>{tracker_devolucion? tracker_devolucion.nombre_estado : ''}</p>
        );
      }
    },
    {
      title: "Carrier",
      dataIndex: "tracker_devolucion",
      render: (tracker_devolucion, row) => {
        const mostrarCarriers = () => {
          logisticoService.getCarriers(row.id).then(({data}) => {
            setCarriers(data.carriers);
            setDia(data.dia);
          });
        }
        const seleccionar = (carrier) => {
          devolucionService.createWayBill(row.id, carrier).then((response) => {
            const newdata = response;
            toastr.success(response.data.message);
            devolucionService.generateCarrierWayBill(row.id, newdata, carrier).then(({data}) => {
              toastr.success(data.message);
              fetchAll();
            })
          });
        }
        const columns = [
          {
            title: "Nombre",
            dataIndex: 'nombre',
            key: 'nombre',
            render: text => <a>{text}</a>
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
              tracker_devolucion &&
              <>
              {
                tracker_devolucion.estado === 1 && 
                <Popover content={content} title="" trigger="click">
                  <Button type="primary" onClick={ mostrarCarriers }>Elegir +</Button>
                </Popover>
              }
              {
                tracker_devolucion.estado > 1 && 
                <p>El operador logístico ya fue seleccionado.</p>
              }
              </>
            }
            {
              !tracker_devolucion &&
              <p style={{ color: "red" }}>No existe tracker</p>
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

    devolucionService.getAll(searchObj).then(({ data }) => {
      setPagination({
        ...paginationTab,
        current: data.current,
        total: data.total,
      });
      setRows(data.data);
    });
  };

  return (
    <Page title="Devoluciones">
      <Buscar form={form} handleParentSearch={fetchAll}/>
      <Card>
        <CardHeader>
          Lista de Devoluciones
        </CardHeader>
        <CardBody>
          <Table
            columns={columns}
            rowKey={(record) => record.id}
            dataSource={rows}
            pagination={pagination}
            loading={loading}
            onChange={fetchAll}
            scroll={{ x: 2400}}
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