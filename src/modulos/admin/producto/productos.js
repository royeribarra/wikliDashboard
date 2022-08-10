import React, { useEffect, useState, useRef } from "react";
import { NavLink, useRouteMatch } from "react-router-dom";
import { connect } from "react-redux";
import { Table, Form, Upload, Button, Image } from "antd";
import { ProductoService } from "../../../servicios/productoService";
import { updateMigas } from "../../../redux/actions/routeActions";
import DeleteProducto from "./deleteProducto";
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

const ProductosWiqli = ({ updateMigas }) => {
  const productoService = new ProductoService("wiqli/productos");
  const { url, path } = useRouteMatch();
  const [form] = Form.useForm();
  const [filesRecorded, setFilesRecorded] = useState([]);
  const btnUploadFileRecorded = useRef(null);
  const [showDelModal, setShowDelModal] = useState(false);
  const [activeRow, setActiveRow] = useState({});

  const beforeUploadRecorded = (file) => {
    filesRecorded.push(file);
    setFilesRecorded(filesRecorded);
  };

  const onRemoveRecorded = (file) => {
    const newFileList = filesRecorded.filter(fileRec => fileRec.uid !== file.uid);
    setFilesRecorded(newFileList);
  };

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
      title: "Categoría",
      dataIndex: "categoria",
      sorter: true,
      render: (categoria) => {
        return (
          <p>{categoria.nombre}</p>
        );
      }
    },
    {
      title: "Unidad de medida",
      dataIndex: "unidad",
      render: (unidad) => {
        return (
          <p>{unidad.nombre}</p>
        );
      }
    },
    {
      title: "Cantidad mínima",
      dataIndex: "cantidad_minima",
      render: (cantidad_minima) => {
        return (
          <p>{cantidad_minima}</p>
        );
      }
    },
    {
      title: "Imagen url",
      dataIndex: "imagen",
      render: (imagen) => {
        return (
          <p>{imagen}</p>
        );
      }
    },
    {
      title: "Subir imagen",
      render: (image) => {
        return (
          <Button>Ver</Button>
        );
      }
    },
    {
      title: "Precio unitario",
      dataIndex: "precio_unitario",
      width: 150,
      render: (precio_unitario) => {
        return (
          <p>{precio_unitario}</p>
        );
      }
    },
    {
      title: "Descripción",
      dataIndex: "nombre",
      render: (nombre) => {
        return (
          <p>{nombre}</p>
        );
      }
    },
    {
      title: "Stock",
      dataIndex: "stock",
      render: (stock) => {
        return (
          <p>{stock}</p>
        );
      }
    },
    {
      title: "Editar",
      dataIndex: "id",
      render: (id) => {
        return (
          <NavLink className="toggle__item" to={`/admin/productos/${id}`}>
            <ButtonReact color="warning">Editar</ButtonReact>
          </NavLink>
        );
      },
    },
    {
      title: "Eliminar",
      dataIndex: "id",
      fixed: "right",
      render: (id, row) => {
        return (
          <ButtonReact color="danger" onClick={() => deleteRecord(id, row)}>Eliminar</ButtonReact>
        );
      },
    }
  ];

  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [loading] = useState(false);

  const handleTableChangeUser = (values) => {
    const { current } = values;
    fetchAll(current);
  };

  const fetchAll = (paginationTab = pagination) => {
    console.log(paginationTab)
    const values = form.getFieldsValue();
    const searchObj = {
      ...values,
      page: paginationTab? paginationTab.current : 1
    }

    productoService.getAll(searchObj).then(({ data }) => {
      setPagination({
        ...paginationTab,
        current: paginationTab.current,
        total: data.total,
      });
      setRows(data.data);
    });
  };

  const uploadCsv = () => {
    const formData = new FormData();
    filesRecorded.forEach((file) => {
      if (!file.id) {
        formData.append("file_csv[]", file);
      }
    });
    productoService
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

  const deleteRecord = (id, row) => {
    setActiveRow(row);
    setShowDelModal(true);
  };

  useEffect(() => {
    updateMigas(url);

    if (!rows.length) {
      fetchAll();
    }
  }, []);

  return (
    <Page title="Productos">
      <Buscar form={form} handleParentSearch={fetchAll}/>
      <Card style={{ marginBottom: "15px" }}>
        <CardHeader>
          Subir Csv
        </CardHeader>
        <CardBody>
          <div className="col-md-6">
            <div style={{ paddingBottom: "10px" }}>
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
                >
                  Agregar archivos
                </Button>
              </Upload>
            </div>
            <ButtonReact type="primary" onClick={uploadCsv}>
              Guardar
            </ButtonReact>
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardHeader>Lista de productos</CardHeader>
        <CardBody>
          <div className="row">
            <div className="col-md-6">
              <NavLink
                exact={false}
                to={`producto/crear`}
                className="item__link boton  boton--transparent-azul "
              >
                <ButtonReact color="primary" className="mr-1">
                  Crear Producto
                </ButtonReact>
              </NavLink>
            </div>
            
          </div>
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
            <DeleteProducto 
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

export default connect(mapStateToProps, mapDispatchToProps)(ProductosWiqli);