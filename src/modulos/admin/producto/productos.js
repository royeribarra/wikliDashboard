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

  const handleParentSearch = () => {
    let newPagination = {
      current: 1,
      pageSize: 10,
      total: 0,
    }
    fetchAll(newPagination);
  }

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

  let columns = [
    {
      title: "Producto",
      dataIndex: "producto_nombre",
      sorter: true,
      render: (producto_nombre) => {
        return (
          <p>{producto_nombre}</p>
        );
      }
    },
    {
      title: "Categoría",
      dataIndex: "categoria_nombre",
      sorter: true,
      render: (categoria_nombre) => {
        return (
          <p>{categoria_nombre}</p>
        );
      }
    },
    {
      title: "Unidad de medida",
      dataIndex: "unidad_medida_nombre",
      render: (unidad_medida_nombre) => {
        return (
          <p>{unidad_medida_nombre}</p>
        );
      }
    },
    {
      title: "Cantidad mínima",
      dataIndex: "producto_cantidad_minima",
      render: (producto_cantidad_minima) => {
        return (
          <p>{producto_cantidad_minima}</p>
        );
      }
    },
    {
      title: "Imagen url",
      dataIndex: "producto_imagen",
      render: (producto_imagen) => {
        return (
          <p>{producto_imagen}</p>
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
      dataIndex: "producto_precio_unitario",
      width: 150,
      render: (producto_precio_unitario) => {
        return (
          <p>{producto_precio_unitario}</p>
        );
      }
    },
    {
      title: "Descripción",
      dataIndex: "producto_nombre",
      render: (producto_nombre) => {
        return (
          <p>{producto_nombre}</p>
        );
      }
    },
    {
      title: "Stock",
      dataIndex: "producto_stock",
      render: (producto_stock) => {
        return (
          <p>{producto_stock}</p>
        );
      }
    },
    {
      title: "Editar",
      dataIndex: "producto_id",
      render: (producto_id) => {
        return (
          <NavLink className="toggle__item" to={`/admin/productos/${producto_id}`}>
            <ButtonReact color="warning">Editar</ButtonReact>
          </NavLink>
        );
      },
    },
    {
      title: "Eliminar",
      dataIndex: "producto_id",
      fixed: "right",
      render: (producto_id, row) => {
        return (
          <ButtonReact color="danger" onClick={() => deleteRecord(producto_id, row)}>Eliminar</ButtonReact>
        );
      },
    }
  ];

  return (
    <Page title="Productos">
      <Buscar form={form} handleParentSearch={handleParentSearch}/>
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