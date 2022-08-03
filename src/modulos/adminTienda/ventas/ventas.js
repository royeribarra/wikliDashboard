import React, { useEffect, useState, useRef } from "react";
import { useRouteMatch } from "react-router-dom";
import { connect } from "react-redux";
import { Table, Form, Upload, Button } from "antd";
import { VentaService } from "../../../servicios/ventaService";
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

const Ventas = ({ updateMigas }) => {
  const ventaService = new VentaService("ventas");
  const { url, path } = useRouteMatch();
  const [form] = Form.useForm();
  const [filesRecorded, setFilesRecorded] = useState([]);
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
  });
  const [loading] = useState(false);
  const btnUploadFileRecorded = useRef(null);

  const beforeUploadRecorded = (file) => {
    filesRecorded.push(file);
    setFilesRecorded(filesRecorded);
  };

  const onRemoveRecorded = (file) => {
    const newFileList = filesRecorded.filter(fileRec => fileRec.uid !== file.uid);

    setFilesRecorded(newFileList);
  };

  const uploadCsv = () => {
    const formData = new FormData();
    filesRecorded.forEach((file) => {
      if (!file.id) {
        formData.append("file_csv[]", file);
      }
    });
    ventaService
      .uploadCsv(formData, { "Content-Type": "multipart/form-data" })
      .then(
        ({ data }) => {
          toastr.success(data[0].original.message);
          setFilesRecorded([]);
          fetchAll();
        },
        () => {}
      );
  }
  
  const fetchAll = (paginationTab = pagination) => {
    const values = form.getFieldsValue();
    const searchObj = {
      ...values,
      page: paginationTab? paginationTab.current : 1
    }

    ventaService.getAll(searchObj).then(({ data }) => {
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

  let columns = [
    {
      title: "Código compra",
      dataIndex: "codigo_compra",
      sorter: true,
      render: (codigo_compra) => {
        return (
          <p>{codigo_compra}</p>
        );
      }
    },
    {
      title: "Fecha Compra",
      dataIndex: "fecha_compra",
      render: (fecha_compra) => {
        return (
          <p>{fecha_compra.substr(0,10)}</p>
        );
      }
    },
    {
      title: "SKU",
      dataIndex: "sku",
      render: (sku) => {
        return (
          <p>{sku}</p>
        );
      }
    },
    {
      title: "Descripción",
      dataIndex: "nombre_producto",
      render: (nombre_producto) => {
        return (
          <p>{nombre_producto}</p>
        );
      }
    },
    {
      title: "Cantidad",
      dataIndex: "cantidad",
      render: (cantidad) => {
        return (
          <p>{cantidad}</p>
        );
      }
    },
    {
      title: "Precio (S/)",
      dataIndex: "precio_pagado",
      render: (precio_pagado) => {
        return (
          <p>{precio_pagado}</p>
        );
      }
    },
    {
      title: "Nombre cliente",
      dataIndex: "nombre_cliente",
      render: (nombre_cliente) => {
        return (
          <p>{nombre_cliente}</p>
        );
      }
    },
    {
      title: "Apellido cliente",
      dataIndex: "apellido_cliente",
      render: (apellido_cliente) => {
        return (
          <p>{apellido_cliente}</p>
        );
      }
    },
    {
      title: "DNI",
      dataIndex: "numero_documento",
      render: (numero_documento) => {
        return (
          <p>{numero_documento}</p>
        );
      }
    },
    {
      title: "Teléfono",
      dataIndex: "telefono",
      render: (telefono) => {
        return (
          <p>{telefono}</p>
        );
      }
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (email) => {
        return (
          <p>{email}</p>
        );
      }
    },
    {
      title: "Dirección",
      dataIndex: "direccion",
      render: (direccion) => {
        return (
          <p>{direccion}</p>
        );
      }
    },
    {
      title: "Distrito",
      dataIndex: "distrito",
      render: (distrito) => {
        return (
          <p>{distrito}</p>
        );
      }
    }
  ];
  
  return (
    <Page title="Ventas">
      <Buscar form={form} handleParentSearch={fetchAll}/>
      <Card>
        <CardHeader>Lista de ventas</CardHeader>
        <CardBody>
          <div style={{ marginBottom: "10px" }}>
            <div style={{ marginBottom: "10px" }}>
              <Upload
                className="documents__content"
                uploading={false}
                fileList={filesRecorded}
                multiple
                beforeUpload={beforeUploadRecorded}
                onRemove={onRemoveRecorded}
                onPreview={(e) => {
                  window.open(`${STORAGE_URL}${e.full_path}`);
                }}
              >
                <Button
                  ref={btnUploadFileRecorded}
                  type="primary"
                  style={{ marginRight: "10px" }}
                >
                  Agregar archivos
                </Button>
              </Upload>
            </div>
            <ButtonReact type="primary" onClick={uploadCsv}>
              Guardar
            </ButtonReact>
          </div>
          <div>
            <Table
              columns={columns}
              rowKey={(record) => record.id}
              dataSource={rows}
              pagination={pagination}
              loading={loading}
              onChange={fetchAll}
              scroll={{x : 2400}}
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

export default connect(mapStateToProps, mapDispatchToProps)(Ventas);