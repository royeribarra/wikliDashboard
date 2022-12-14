import React, { useEffect, useState } from "react";
import { NavLink, useRouteMatch,  useHistory, useParams } from "react-router-dom";
import { Form, Input, Upload, Button, Select } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import { ProductoService } from "../../../servicios/productoService";
import { UnidadService } from "../../../servicios/unidadService";
import { CategoriaService } from "../../../servicios/categoriaService";
import { updateMigas } from "../../../redux/actions/routeTiendaActions";
import Page from '../../../components/Page';
import {
  Card,
  CardBody,
  Button as ButtonReact
} from 'reactstrap';

const { Option } = Select;
const validateMessages = {
  required: "${label} es requerido!",
  types: {
    email: "${label} no es un correo válido!",
    number: "${label} no es válido!",
  },
  number: {
    range: "${label} debe estar entre ${min} y ${max} carácteres!",
  },
};

const ProductoExternoForm = ({ updateMigas }) => {
  const [form] = Form.useForm();
  const productoService = new ProductoService("wiqli/producto-scrapeado");
  const unidadService = new UnidadService("wiqli/unidades/todos");
  const categoriaService = new CategoriaService("wiqli/categorias/todos");
  const productoWiqliService = new ProductoService("wiqli/productos");
  //const { id } = useParams();
  const params = useParams();
  const history = useHistory();
  const [actImage, setActImage] = useState("");
  const [image, setImage] = useState(null);
  const [archivos, setArchivos] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [productosWiqli, setProductosWiqli] = useState([]);

  const getProductoInfo = (id) => {
    productoService.get(id).then(
      ({ data }) => {
        data = { ...data, id };
        form.setFieldsValue(data);
        setActImage(data.imagen);
      },
      (err) => {
      }
    );
  };

  function goToList() {
    history.push("/admin/scraping/productos-externos");
  }

  const onFinish = (values) => {
    const header = {
      "Content-Type": "multipart/form-data",
    };
    const formData = new FormData();
    //formData.append("image", image);
    for (var key in values) {
      formData.append(key, values[key]);
    }
    archivos.forEach(file => {
      formData.append('files[]', file.originFileObj);
    });
    if(params.productoId){
      productoService.updateProduct(formData, params.productoId, header).then(
        ({data}) => {
          if(data.state){
            toastr.success(data.message)
            goToList();
          }
          
        },
        () => {}
      );
    }else{
      productoService.storeProduct(formData, params.productoId, header).then(
        ({data}) => {
          if(data.state){
            toastr.success(data.message)
            goToList();
          }
        },
        () => {}
      );
    }
  };

  const onFileChange = (event) => {
    const file = event.target.files[0];
    let img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      setImage(file);
      setActImage(URL.createObjectURL(file));
    };
  };

  const { url, path } = useRouteMatch();

  const normFile = (e) => {
    setArchivos(e.fileList);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
    
  };

  useEffect(() => {
    updateMigas(url) 

    if (params.productoId) {
      getProductoInfo(params.productoId);
    }
  }, [] );

  useEffect(() => {
    productoWiqliService.todosProductosParaScraping().then(({data})=> {
      setProductosWiqli(data);
    });
    unidadService.getTodos().then(({data})=> {
      setUnidades(data);
    });
    categoriaService.getTodos().then(({data})=> {
      setCategorias(data);
    });
  }, [])
  
  return (
    <Page title="Información general">
      <Card>
        <CardBody>
          <Form
            className="formulario"
            name="nest-messages"
            onFinish={onFinish}
            form={form}
            validateMessages={validateMessages}
            layout="vertical"
          >
            <div className="caja-contenedor__body mt-2">
              <div className="row">
                <div className="col-md-6">
                  <Form.Item
                    className="formulario__label"
                    name={"nombre"}
                    label="Nombre"
                    rules={[{ required: true }]}
                  >
                    <Input className="input-padre" />
                  </Form.Item>
                </div>
                <div className="col-md-6">
                  <Form.Item
                    className="formulario__label"
                    name={"wiqli_producto_id"}
                    label="Producto asociado"
                    rules={[{ required: true }]}
                  >
                    <Select>
                      {
                       productosWiqli.map((producto) => 
                        <Option value={producto.id}>{producto.nombre}</Option>
                       ) 
                      }
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-md-6">
                  <Form.Item
                    className="formulario__label"
                    name={"url_vea"}
                    label="Link Vea"
                    rules={[{ required: true }]}
                  >
                    <Input className="input-padre" />
                  </Form.Item>
                </div>
                <div className="col-md-6">
                  <Form.Item
                    className="formulario__label"
                    name={"multiplicador_vea"}
                    label="Multiplicador Vea"
                    rules={[{ required: true }]}
                  >
                    <Input className="input-padre" />
                  </Form.Item>
                </div>
                <div className="col-md-6">
                  <Form.Item
                    className="formulario__label"
                    name={"url_tottus"}
                    label="Link Tottus"
                    rules={[{ required: true }]}
                  >
                    <Input className="input-padre" />
                  </Form.Item>
                </div>
                <div className="col-md-6">
                  <Form.Item
                    className="formulario__label"
                    name={"multiplicador_tottus"}
                    label="Multiplicador Tottus"
                    rules={[{ required: true }]}
                  >
                    <Input className="input-padre" />
                  </Form.Item>
                </div>
                <div className="col-md-6">
                  <Form.Item
                    className="formulario__label"
                    name={"url_wong"}
                    label="Link Wong"
                    rules={[{ required: true }]}
                  >
                    <Input className="input-padre" />
                  </Form.Item>
                </div>
                <div className="col-md-6">
                  <Form.Item
                    className="formulario__label"
                    name={"multiplicador_wong"}
                    label="Multiplicador Wong"
                    rules={[{ required: true }]}
                  >
                    <Input className="input-padre" />
                  </Form.Item>
                </div>
              </div>
            </div>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ margin: "10px" }}>
                Guardar
              </Button>
              <NavLink to="/admin/scraping/productos-externos">
                <Button type="danger" style={{ margin: "10px" }}>Cancelar</Button>
              </NavLink>
            </Form.Item>
          </Form>
        </CardBody>
      </Card>
    </Page>
  );
};


const mapDispatchToProps = (dispatch) => {
  return {
    updateMigas:  (values) => {
      dispatch(updateMigas(values));
    },
  }
};

const mapStateToProps = (state) => {
  const { profiles, sedes } = state.userReducer;
  return {
    profiles,
    sedes,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductoExternoForm);