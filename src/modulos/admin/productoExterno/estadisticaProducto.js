import React, { useEffect, useState, useRef } from "react";
import { NavLink, useRouteMatch, useParams } from "react-router-dom";
import { connect } from "react-redux";
import { Table, Form, Upload, Button, Image } from "antd";
import { EstadisticaService } from "../../../servicios/estadisticaService";
import { updateMigas } from "../../../redux/actions/routeActions";
import Buscar from "./buscar";
import { STORAGE_URL } from "../../../config/constants";
import { toastr } from "react-redux-toastr";
import Page from '../../../components/Page';
import {
  Card,
  CardBody,
  CardHeader,
  Button as ButtonReact
} from 'reactstrap';

const EstadisticaProducto = ({ updateMigas }) => {
  const estadisticaService = new EstadisticaService("wiqli/producto-externo/estadistica");
  const { url, path } = useRouteMatch();
  const [form] = Form.useForm();
  const [filesRecorded, setFilesRecorded] = useState([]);
  const btnUploadFileRecorded = useRef(null);
  const [showDelModal, setShowDelModal] = useState(false);
  const params = useParams();
  const [activeRow, setActiveRow] = useState({});
  const [rows, setRows] = useState([]);
  const [loading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const getProductoInfo = (id) => {
    estadisticaService.get(id).then(
      ({ data }) => {
        data = { ...data, id };
        setRows(data.data);
      },
      (err) => {
      }
    );
  };

  const fetchAll = (paginationTab = pagination) => {
    const values = form.getFieldsValue();
    const searchObj = {
      ...values,
      page: paginationTab? paginationTab.current : 1
    }

    estadisticaService.getAll(searchObj).then(({ data }) => {
      setPagination({
        ...paginationTab,
        current: paginationTab.current,
        total: data.total,
      });
      setRows(data.data);
    });
  };

  const handleParentSearch = () => {
    let newPagination = {
      current: 1,
      pageSize: 10,
      total: 0,
    }
    fetchAll(newPagination);
  }

  const deleteRecord = (id, row) => {
    setActiveRow(row);
    setShowDelModal(true);
  };

  useEffect(() => {
    updateMigas(url);

    if (params.productoId) {
      getProductoInfo(params.productoId);
    }
  }, []);

  let columns = [
    {
      title: "Producto",
      dataIndex: "nombre",
      sorter: true,
      render: (nombre) => {
        return (
          <p>{nombre}</p>
        );
      }
    },
    {
      title: "Tienda",
      dataIndex: "tienda",
      sorter: true,
      render: (tienda) => {
        return (
          <>
          {
            tienda === 1 && 
            <p>
              Plaza Vea
            </p>
          }
          {
            tienda === 2 && 
            <p>
              Tottus
            </p>
          }
          {
            tienda === 3 && 
            <p>
              Wong
            </p>
          }
          </>
        );
      }
    },
    {
      title: "Precio tienda",
      dataIndex: "precio_externo",
      render: (precio_externo, row) => {
        return (
          <p>{precio_externo * row.multiplicador}</p>
        );
      }
    },
    {
      title: "Precio Wiqli",
      dataIndex: "precio_wiqli",
      render: (precio_wiqli) => {
        return (
          <p>{precio_wiqli}</p>
        );
      }
    },
    {
      title: "Diferencia",
      dataIndex: "id",
      render: (id, row) => {
        return (
          <p>{ parseFloat(row.precio_wiqli - (row.precio_externo * row.multiplicador)).toFixed(2)}</p>
        );
      }
    },
    {
      title: "Creación",
      dataIndex: "created_at",
      render: (created_at) => {
        return (
          <p>{ created_at.substr(0, 10)}</p>
        );
      }
    }
  ];

  return (
    <Page title="Precios">
      
      <Card>
        <CardHeader>Lista de precios</CardHeader>
        <CardBody>
          <div>
            <Table
              columns={columns}
              rowKey={(record) => record.id}
              dataSource={rows}
              pagination={pagination}
              loading={loading}
              onChange={fetchAll}
              bordered
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

export default connect(mapStateToProps, mapDispatchToProps)(EstadisticaProducto);