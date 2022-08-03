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

const Productos = ({ updateMigas }) => {
  const productoService = new ProductoService("products");
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
      title: "SKU",
      dataIndex: "sku",
      sorter: true,
      render: (sku) => {
        return (
          <p>{sku}</p>
        );
      }
    },
    {
      title: "Imagen",
      dataIndex: "image",
      render: (image, row) => {
        return (
          <Image src={image ? image : `http://localhost/tiendas/${row.dimensiones}`} alt="" width={75} />
        );
      }
    },
    {
      title: "Precio (S/)",
      dataIndex: "price",
      width: 150,
      render: (price) => {
        return (
          <p>{price}</p>
        );
      }
    },
    {
      title: "Nombre",
      dataIndex: "name",
      render: (name) => {
        return (
          <p>{name}</p>
        );
      }
    },
    {
      title: "Color",
      dataIndex: "color",
      render: (color) => {
        return (
          <p>{color}</p>
        );
      }
    },
    {
      title: "Talla",
      dataIndex: "talla",
      render: (talla) => {
        return (
          <p>{talla}</p>
        );
      }
    },
    {
      title: "Stock",
      dataIndex: "stock_quantity",
      render: (stock_quantity, record) => {
        const agregarInventario = () => {
          productoService.agregarInventario(record.id).then((response) => {
            fetchAll();
          });
        }
        const disminuirInventario = () => {
          productoService.disminuirInventario(record.id).then((response) => {
            fetchAll();
          });
        }
        return (
          <div className="container-fluid" style={{ textAlign: "center"}}>
            <div>
              <Button type="primary" onClick={agregarInventario} size="small" shape="circle">+</Button>
            </div>
            <div>
              <span>{stock_quantity}</span>
            </div>
            <div>
              <Button type="primary" onClick={disminuirInventario} size="small" shape="circle">-</Button>
            </div>
          </div>
        );
      },
    },
    {
      title: "Editar",
      dataIndex: "id",
      render: (id) => {
        return (
          <NavLink className="toggle__item" to={`/tienda/productos/${id}`}>
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
    pageSize: 15,
    total: 0,
  });
  const [loading] = useState(false);

  const handleTableChangeUser = (values) => {
    const { current } = values;
    fetchAll(current);
  };

  const fetchAll = (paginationTab = pagination) => {
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

export default connect(mapStateToProps, mapDispatchToProps)(Productos);