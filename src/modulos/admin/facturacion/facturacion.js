import React, { Fragment, useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import { connect } from "react-redux";
import { Table, Form, DatePicker, Select } from "antd";
import { updateMigas } from "../../../redux/actions/routeActions";
import Buscar from "./buscar";
import { RepoFacturacionService } from "../../../servicios/admin/repoFacturacionService";
import DeleteFacturacion from "./deleteFacturacion";
import Page from '../../../components/Page';
import "./facturacion.css"

import {
  Button,
  Card,
  CardBody,
  CardHeader
} from 'reactstrap';

const { RangePicker } = DatePicker;
const { Option } = Select;

const Facturacion = ({ updateMigas }) => {
  const facturacionService = new RepoFacturacionService("repo/facturacion");
  const { url, path } = useRouteMatch();
  const [form] = Form.useForm();

  let columns = [
    {
      title: "Fecha",
      dataIndex: "created_at",
      sorter: true,
      render: (created_at) => {
        return (
          <p>{created_at.substr(0,10)}</p>
        );
      }
    },
    {
      title: "Tienda",
      dataIndex: "tienda",
      render: (tienda) => {
        const lugar = tienda ? tienda.business_name : 'Repo';
        return (
          <p>{lugar}</p>
        );
      },
    },
    {
      title: "Código",
      dataIndex: "codigo_repo",
      sorter: true,
      render: (codigo_repo) => {
        return (
          <p>{codigo_repo}</p>
        );
      }
    },
    {
      title: "Producto a devolver",
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
      title: "Monto base (S/)",
      dataIndex: "producto_gestion",
      render: (producto_gestion) => {
        let monto_base = 0;
        const content = producto_gestion.forEach(element => {
          monto_base = parseFloat(monto_base + element.precio).toFixed(2);
        });
        return (
          <p>{monto_base}</p>
        );
      }
    },
    {
      title: "Proceso",
      dataIndex: "servicio",
      render: (servicio) => {
        return (
          <p>{servicio.nombre}</p>
        );
      }
    },
    {
      title: "Fee Repo (S/)",
      dataIndex: "producto_gestion",
      render: (producto_gestion) => {
        let monto_base = 0;
        const content = producto_gestion.forEach(element => {
          monto_base = parseFloat(monto_base + element.precio).toFixed(2);
        });
        let total = 0;
        if(feesTienda.tienda_fee_cambio.tipo === 1){
          total = parseFloat(monto_base*feesTienda.tienda_fee_cambio.monto/100).toFixed(2);
        }else if(feesTienda.tienda_fee_cambio.tipo === 2){
          total = parseFloat(feesTienda.tienda_fee_cambio.monto).toFixed(2);
        }
        
        return (
          <p>{total}</p>
        );
      }
    },
    {
      title: "Fee logístico (S/)",
      dataIndex: "cliente_paga_logistico",
      render: (cliente_paga_logistico, row) => {
        let costo_logistico = 0.00;
        if(!cliente_paga_logistico){
          if(row.tipo_servicio === 1 || row.tipo_servicio === 4){
            costo_logistico = 15.00;
          }
          if(row.tipo_servicio === 2){
            costo_logistico = 20.00;
          }
          if(row.tipo_servicio === 3){
            costo_logistico = 10.00;
          }
        }
        return (
          <p>{parseFloat(costo_logistico).toFixed(2)}</p>
        );
      }
    },
    {
      title: "Upselling (S/)",
      dataIndex: "nuevos_productos",
      render: (nuevos_productos, row) => {
        let monto_devolucion = 0, monto_nuevos_productos = 0;
        const content = nuevos_productos.forEach(element => {
          monto_nuevos_productos = parseFloat(monto_nuevos_productos + element.precio).toFixed(2);
        });
        const content1 = row.producto_gestion.forEach(element => {
          monto_devolucion = parseFloat(monto_devolucion + element.precio).toFixed(2);
        });
        let upselling = parseFloat(monto_nuevos_productos - monto_devolucion).toFixed(2);
        return (
          <>
            {
              (row.tipo_servicio === 3 || row.tipo_servicio === 4) && 
              <p>N.A</p>
            }
            {
              (row.tipo_servicio === 1 || row.tipo_servicio === 2) && 
              <p>{upselling}</p>
            }
          </>
        );
      }
    },
    {
      title: "Fee upselling (S/)",
      dataIndex: "nuevos_productos",
      render: (nuevos_productos, row) => {
        let monto_devolucion = 0, monto_nuevos_productos = 0;
        const content = nuevos_productos.forEach(element => {
          monto_nuevos_productos = parseFloat(monto_nuevos_productos + element.precio).toFixed(2);
        });
        const content1 = row.producto_gestion.forEach(element => {
          monto_devolucion = parseFloat(monto_devolucion + element.precio).toFixed(2);
        });
        let upselling = parseFloat(monto_nuevos_productos - monto_devolucion).toFixed(2);
        let total = parseFloat(upselling*5/100).toFixed(2);
        return (
          <>
            {
              (row.tipo_servicio === 3 || row.tipo_servicio === 4) && 
              <p>N.A</p>
            }
            {
              (row.tipo_servicio === 1 || row.tipo_servicio === 2) && 
              <p>{total}</p>
            }
          </>
        );
      }
    },
    // {
    //   title: "Boleta",
    //   dataIndex: "id",
    //   render: (id) => {
    //     return (
    //       <NavLink className="toggle__item" to={`/admin/usuarios/${id}`}>
    //         <Button>

    //         </Button>
    //         <span className="toggle__item-icono icono icon-editar ml-2"></span>
    //       </NavLink>
    //     );
    //   },
    // },
    {
      title: "Facturación",
      dataIndex: "",
      render: (row) => {
        const { id, es_facturado } = row;
        return (
          <Fragment>
            {es_facturado ? (
              <Button
                onClick={() => deleteFacturacion(id, row)}
                color="info"
              >
                Activo
              </Button>
            ) : (
              <Button
                color="danger"
                onClick={() => agregarFacturacion(id, row)}
              >
                Inactivo
              </Button>
            )}
          </Fragment>
        );
      },
    },
  ];

  const [rows, setRows] = useState([]);
  const [activeRow, setActiveRow] = useState({});
  const [showDelModal, setShowDelModal] = useState(false);
  const [feesTienda, setFeesTienda] = useState({
    'fee_logistico': 0, 'fee_repo': 0, 'fee_upselling': 0,
    'tienda_fee_cambio': {'codigo': null, 'monto': 0, 'tipo' : null},
    'tienda_fee_devolucion': {'codigo': null, 'monto': 0, 'tipo' : null}, 
    'tienda_fee_upselling': {'codigo': null, 'monto': 0, 'tipo' : null}, 
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
  });
  const [loading] = useState(false);

  const handleTableChangeUser = (values) => {
    const { current } = values;
    fetchAll(current);
  };

  const changeStatusUsers = (id, state) => {
    const dataChangeStatus = {
      id,
      state,
    };

    facturacionService.changeStatus(dataChangeStatus).then(() => {
      fetchAll(pagination.current);
    });
  };

  const deleteFacturacion = (id, row) => {
    setActiveRow(row);
    setShowDelModal(true);
  };

  const agregarFacturacion = (id, row) => {
    setActiveRow(row);
    setShowDelModal(true);
  };

  useEffect(() => {
    updateMigas(url);

    if (!rows.length) {
      fetchAll();
    }
  }, []);

  const fetchAll = (paginationTab = pagination) => {
    const values1 = form.getFieldsValue();
    const rangeValue = values1['fecha'];
    const values = {
      ...form.getFieldsValue(),
      'fecha': [rangeValue ? rangeValue[0].format('YYYY-MM-DD') : '', rangeValue ? rangeValue[1].format('YYYY-MM-DD') : '']
    };
    const searchObj = {
      ...values,
      page: paginationTab? paginationTab.current : 1
    }

    facturacionService.getAll(searchObj).then(({ data }) => {
      setPagination({
        ...paginationTab,
        current: data.current,
        total: data.total,
      });
      setRows(data.data);
    });
  };

  const onChangeTipoReporte = (value) => {
  }

  const getFeesTienda = (fechainicial, fechafinal, tienda_id) => {
    facturacionService.getFees(fechainicial, fechafinal, tienda_id).then(({data}) => {
      setFeesTienda(data);
    });
  }

  const onFinish = (values) =>{
  }

  return (
    <Page title="Facturación">
      <Buscar titulo="Filtrar" form={form} handleParentSearch={fetchAll} getFeesTienda={getFeesTienda} />
      <Card style={{ marginBottom: "15px" }}>
        <CardHeader>
          Resumen General
        </CardHeader>
        <CardBody>
          <div style={{ backgroundColor: "white", color: "black", margin: "10px 0px"}}>
            <div className="data-informativa" style={{ backgroundColor: "#EAF2F1"}}>
              <div>Total fee logístico:</div>
              <div>S/ {parseFloat(feesTienda.fee_logistico).toFixed(2)}</div>
            </div>
            <div className="data-informativa">
              <div>Total upselling</div>
              <div>S/ {parseFloat(feesTienda.fee_upselling).toFixed(2)}</div>
            </div>
            <div className="data-informativa" style={{ backgroundColor: "#EAF2F1"}}>
              <div>Total fee Repo ({feesTienda.tienda_fee_cambio.tipo === 1 ? feesTienda.tienda_fee_cambio.monto + '%' : feesTienda.tienda_fee_cambio.monto} D / {feesTienda.tienda_fee_devolucion.tipo === 1 ? feesTienda.tienda_fee_devolucion.monto + '%' : feesTienda.tienda_fee_devolucion.monto} C/ {feesTienda.tienda_fee_upselling.tipo === 1 ? feesTienda.tienda_fee_upselling.monto + '%' : feesTienda.tienda_fee_upselling.monto}):</div>
              <div>S/ {parseFloat(feesTienda.fee_repo).toFixed(2)}</div>
            </div>
            <div className="data-informativa">
              <div>Total de cobro:</div>
              <div>S/ {parseFloat(feesTienda.fee_logistico + feesTienda.fee_upselling + feesTienda.fee_repo).toFixed(2)}</div>
            </div>
          </div>
        </CardBody>
      </Card>
      <Card style={{ marginBottom: "15px" }}>
        <CardHeader>
          Lista de procesos
        </CardHeader>
        <CardBody>
          <div>
            <Table
              columns={columns}
              rowKey={(record) => record.id}
              dataSource={rows}
              pagination={pagination}
              loading={loading}
              onChange={fetchAll}
              scroll={{x : 1800}}
            />
            <DeleteFacturacion
              status={showDelModal}
              handleClose={setShowDelModal}
              handleRefreshTable={fetchAll}
              activeRow={activeRow}
            />
          </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Facturacion);
