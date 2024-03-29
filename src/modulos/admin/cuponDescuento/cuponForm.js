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
  CardBody
} from 'reactstrap';

const { Option } = Select;

const CuponForm = ({ updateMigas }) => {
  const [form] = Form.useForm();
  const productoService = new ProductoService("wiqli/producto");
  const unidadService = new UnidadService("wiqli/unidades/todos");
  const categoriaService = new CategoriaService("wiqli/categorias/todos");
  const params = useParams();
  const history = useHistory();
  const [actImage, setActImage] = useState("");
  const [archivos, setArchivos] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [categorias, setCategorias] = useState([]);

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
    history.push("/admin/productos");
  }

  const onFinish = (values) => {
    const header = {
      "Content-Type": "multipart/form-data",
    };
    const formData = new FormData();
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

  const { url } = useRouteMatch();

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
                    name={"cantidad_minima"}
                    label="Cantidad Mínima"
                    rules={[{ required: true }]}
                  >
                    <Input className="input-padre" />
                  </Form.Item>
                </div>
                <div className="col-md-6">
                  <Form.Item
                    className="formulario__label"
                    name={"categoria_id"}
                    label="Categoría"
                    rules={[{ required: true }]}
                  >
                    <Select>
                      {
                       categorias.map((categoria) => 
                        <Option value={categoria.id}>{categoria.nombre}</Option>
                       ) 
                      }
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-md-6">
                  <Form.Item
                    className="formulario__label"
                    name={"imagen"}
                    label="Imagen"
                  >
                    <Input className="input-padre" />
                  </Form.Item>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <Form.Item
                    className="formulario__label"
                    name={"precio_unitario"}
                    label="Precio unitario"
                    rules={[{ required: true }]}
                  >
                    <Input className="input-padre" />
                  </Form.Item>
                </div>
                <div className="col-md-6">
                  <Form.Item
                    className="formulario__label"
                    name={"stock"}
                    label="Stock"
                  >
                    <Input className="input-padre" />
                  </Form.Item>
                </div>
                <div className="col-md-6">
                  <Form.Item
                    className="formulario__label"
                    name={"unidad_id"}
                    label="Unidad"
                    rules={[{ required: true }]}
                  >
                    <Select>
                      {
                       unidades.map((unidad) => 
                        <Option value={unidad.id}>{unidad.nombre}</Option>
                       ) 
                      }
                    </Select>
                  </Form.Item>
                </div>
              </div>
              <div>
                { actImage ? (
                    <img
                        src={`${process.env.REACT_APP_BASE_PATH}/wiqli/`+actImage}
                        style={{ maxHeight: "150px" }}
                    />
                ) : (
                    ""
                )}
                {/* <Form.Item 
                  className="formulario__label"
                  label="Imagen"
                >
                  <input 
                    type="file"
                    onChange={onFileChange}
                    accept="image/png, image/jpeg"
                  >
                  </input>
                </Form.Item> */}
                <Form.Item
                  name="imagen_producto"
                  label="Foto del producto (jpg, png o jepg)"
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                >
                  <Upload name="logo" action="/upload.do" listType="picture" accept="image/*">
                    <Button icon={<UploadOutlined />}>Subir foto</Button>
                  </Upload>
                </Form.Item>
              </div>
            </div>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ margin: "10px" }}>
                Guardar
              </Button>
              <NavLink to="/admin/cupones-descuento">
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

export default connect(mapStateToProps, mapDispatchToProps)(CuponForm);