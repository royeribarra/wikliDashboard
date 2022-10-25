import React, { useEffect, useState, useRef } from "react";
import { NavLink, useRouteMatch, useParams } from "react-router-dom";
import { connect } from "react-redux";
import { Table, Form, Upload, Button, Image } from "antd";
import { EstadisticaService } from "../../../servicios/estadisticaService";
import { updateMigas } from "../../../redux/actions/routeActions";
import { Line } from 'react-chartjs-2';
import Buscar from "./buscar";
import { STORAGE_URL } from "../../../config/constants";
import { toastr } from "react-redux-toastr";
import Page from '../../../components/Page';
import { randomNum } from 'utils/demos';
import { getColor } from 'utils/colors';
import { Row, Col } from "reactstrap";
import {
  Card,
  CardBody,
  CardHeader,
  Button as ButtonReact
} from 'reactstrap';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
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
  const [dataVea, setDataVea] = useState([]);
  const [dataTottus, setDataTottus] = useState([]);
  const [dataWong, setDataWong] = useState([]);
  const [loading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const genLineData = (moreData = {}, moreData2 = {}) => {
    return {
      labels: MONTHS,
      datasets: [
        {
          label: 'Vea',
          backgroundColor: getColor('primary'),
          borderColor: getColor('primary'),
          borderWidth: 1,
          data: [
            randomNum(),
            randomNum(),
            randomNum(),
            randomNum(),
            randomNum(),
            randomNum(),
            randomNum(),
          ],
          ...moreData,
        },
        {
          label: 'Tottus',
          backgroundColor: getColor('secondary'),
          borderColor: getColor('secondary'),
          borderWidth: 1,
          data: [
            randomNum(),
            randomNum(),
            randomNum(),
            randomNum(),
            randomNum(),
            randomNum(),
            randomNum(),
          ],
          ...moreData2,
        },
        {
          label: 'Wong',
          backgroundColor: getColor('success'),
          borderColor: getColor('success'),
          borderWidth: 1,
          data: [
            randomNum(),
            randomNum(),
            randomNum(),
            randomNum(),
            randomNum(),
            randomNum(),
            randomNum(),
          ],
          ...moreData2,
        },
      ],
    };
  };

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

  const getProductoInfoScraping = (id) => {
    estadisticaService.getPreciosScraping(id).then(({data})=> {
      console.log(data)
      if(data.state)
      {
        const vea = [];
        const tottus = [];
        const wong = [];
        data.vea.forEach(el => {
          vea.push(el.precio_unitario_online);
        });
        data.tottus.forEach(el => {
          tottus.push(el.precio_unitario_online);
        });
        data.wong.forEach(el => {
          wong.push(el.precio_unitario_online);
        });
        setDataVea(vea);
        setDataTottus(tottus);
        setDataWong(wong);
      }
    });
  }

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
      getProductoInfoScraping(params.productoId);
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
          <p style={{ color: `${row.precio_wiqli - (row.precio_externo * row.multiplicador) > 0 ? 'red' : 'black' }` }}>
            { parseFloat(row.precio_wiqli - (row.precio_externo * row.multiplicador)).toFixed(2)}
          </p>
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
      <Row>
        <Col xl={6} lg={12} md={12}>
          <Card>
            <CardHeader>Variación de producto</CardHeader>
            <CardBody>
              <Line data={genLineData({ fill: false }, { fill: false })} />
            </CardBody>
          </Card>
        </Col>
      </Row>
      
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