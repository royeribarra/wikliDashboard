import React, { useEffect, useState, useRef } from "react";
import { NavLink, useRouteMatch } from "react-router-dom";
import { connect } from "react-redux";
import { Table, Form, Upload, Button, Image } from "antd";
import { ProductoExternoService } from "../../../servicios/productoExternoService";
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

const ProductoExterno = ({ updateMigas }) => {
  const productoService = new ProductoExternoService("wiqli/productos-scrapeados/todos");
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
      dataIndex: "nombre",
      sorter: true,
      render: (nombre) => {
        return (
          <p>{nombre}</p>
        );
      }
    },
    {
      title: "Wiqli",
      dataIndex: "producto_wiqli",
      sorter: true,
      render: (producto_wiqli) => {
        return (
          <p>{producto_wiqli? producto_wiqli.nombre : ''}</p>
        );
      }
    },
    {
      title: "Precio wiqli",
      dataIndex: "producto_wiqli",
      sorter: true,
      fixed: "left",
      render: (producto_wiqli) => {
        return (
          <p>{producto_wiqli? producto_wiqli.precio_unitario : 'No existe el producto.'}</p>
        );
      }
    },
    // {
    //   title: "Link Vea",
    //   dataIndex: "url_vea",
    //   render: (url_vea) => {
    //     return (
    //       <p>{url_vea}</p>
    //     );
    //   }
    // },
    {
      title: "Multiplicador Vea",
      dataIndex: "multiplicador_vea",
      render: (multiplicador_vea) => {
        return (
          <p>{multiplicador_vea}</p>
        );
      }
    },
    {
      title: "Precio Vea",
      dataIndex: "precio_vea",
      onCell: (text, record) => {
        const fondo = 'red';
        const letra = 'white';
        return {
          ['style']: {background: fondo, color: letra},
          className: 'example-class-in-td',
        };
      },
      render: (precio_vea) => {
        return (
          <p>{precio_vea}</p>
        );
      }
    },
    {
      title: "Diferencia Vea",
      dataIndex: "producto_wiqli",
      render: (producto_wiqli, row) => {
        return (
          <>
            { (producto_wiqli && row.precio_vea) ?
              <p style={{ color: `${producto_wiqli.precio_unitario - (row.precio_vea * row.multiplicador_vea) > 0 ? 'red' : 'black' }` }}>
                { parseFloat(producto_wiqli.precio_unitario - row.precio_vea).toFixed(2)}
              </p> :
              <p style={{ color: "red" }}>No se cuenta con información</p>
            }
          </>
        );
      }
    },
    // {
    //   title: "Link Tottus",
    //   dataIndex: "url_tottus",
    //   render: (url_tottus) => {
    //     return (
    //       <p>{url_tottus}</p>
    //     );
    //   }
    // },
    {
      title: "Multiplicador Tottus",
      dataIndex: "multiplicador_tottus",
      render: (multiplicador_tottus) => {
        return (
          <p>{multiplicador_tottus}</p>
        );
      }
    },
    {
      title: "Precio Tottus",
      dataIndex: "precio_tottus",
      render: (precio_tottus) => {
        return (
          <p>{precio_tottus}</p>
        );
      }
    },
    {
      title: "Diferencia Tottus",
      dataIndex: "producto_wiqli",
      render: (producto_wiqli, row) => {
        return (
          <>
            { (producto_wiqli && row.precio_tottus) ?
              <p style={{ color: `${producto_wiqli.precio_unitario - (row.precio_tottus * row.multiplicador_tottus) > 0 ? 'red' : 'black' }` }}>
                { parseFloat(producto_wiqli.precio_unitario - row.precio_tottus).toFixed(2)}
              </p> :
              <p style={{ color: "red" }}>No se cuenta con información</p>
            }
          </>
        );
      }
    },
    // {
    //   title: "Link Wong",
    //   dataIndex: "url_wong",
    //   render: (url_wong) => {
    //     return (
    //       <p>{url_wong}</p>
    //     );
    //   }
    // },
    {
      title: "Multiplicador Wong",
      dataIndex: "multiplicador_wong",
      render: (multiplicador_wong) => {
        return (
          <p>{multiplicador_wong}</p>
        );
      }
    },
    {
      title: "Precio Wong",
      dataIndex: "precio_wong",
      render: (precio_wong) => {
        return (
          <p>{precio_wong}</p>
        );
      }
    },
    {
      title: "Diferencia Wong",
      dataIndex: "producto_wiqli",
      render: (producto_wiqli, row) => {
        return (
          <>
            { (producto_wiqli && row.precio_wong) ? 
              <p style={{ color: `${producto_wiqli.precio_unitario - (row.precio_wong * row.multiplicador_wong) > 0 ? 'red' : 'black' }` }}>
                { parseFloat(producto_wiqli.precio_unitario - row.precio_wong).toFixed(2)}
              </p> :
              <p style={{ color: "red" }}>No se cuenta con información</p>
            }
          </>
        );
      }
    },
    {
      title: "Estadística",
      dataIndex: "id",
      render: (id) => {
        return (
          <NavLink className="toggle__item" to={`/admin/scraping/producto-externo/estadistica/${id}`}>
            <ButtonReact color="primary">Estadística</ButtonReact>
          </NavLink>
        );
      },
    },
    {
      title: "Editar",
      dataIndex: "id",
      render: (id) => {
        return (
          <NavLink className="toggle__item" to={`/admin/scraping/producto-externo/${id}`}>
            <ButtonReact color="warning">Editar</ButtonReact>
          </NavLink>
        );
      },
    },
    {
      title: "Eliminar",
      dataIndex: "id",
      render: (id, row) => {
        return (
          <ButtonReact color="danger" onClick={() => deleteRecord(id, row)}>Eliminar</ButtonReact>
        );
      },
    }
  ];

  return (
    <Page title="Productos Externos Scraping">
      <Buscar form={form} handleParentSearch={handleParentSearch}/>
      <Card>
        <CardHeader>Lista de productos</CardHeader>
        <CardBody>
          <div className="row">
            <div className="col-md-6">
              <NavLink
                exact={false}
                to={`productos-externos/crear`}
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

export default connect(mapStateToProps, mapDispatchToProps)(ProductoExterno);