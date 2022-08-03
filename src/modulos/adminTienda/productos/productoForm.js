import React, { useEffect, useState } from "react";
import { NavLink, useRouteMatch,  useHistory, useParams } from "react-router-dom";
import { Form, Input, Upload, Button } from "antd";
import { UploadOutlined } from '@ant-design/icons';
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import { ProductoService } from "../../../servicios/productoService";
import { getProfiles, getSedes } from "../../../redux/actions/userActions";
import { updateMigas } from "../../../redux/actions/routeTiendaActions";
import Page from '../../../components/Page';
import {
  Card,
  CardBody,
  Button as ButtonReact
} from 'reactstrap';

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

const ProductoForm = ({ profiles, sedes, getProfiles, getSedes, updateMigas }) => {
  const [form] = Form.useForm();
  const productoService = new ProductoService("products");
  //const { id } = useParams();
  const params = useParams();
  const history = useHistory();
  const [actImage, setActImage] = useState("");
  const [image, setImage] = useState(null);
  const [archivos, setArchivos] = useState([]);

  const getProductoInfo = (id) => {
    productoService.get(id).then(
      ({ data }) => {
        data = { ...data, id };
        form.setFieldsValue(data);
        setActImage(data.dimensiones);
      },
      (err) => {
      }
    );
  };

  function goToList() {
    history.push("/tienda/productos");
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
    if(params.id){
      productoService.updateProduct(formData, params.id, header).then(
        ({data}) => {
          toastr.success(data.message)
          goToList();
        },
        () => {}
      );
    }else{
      productoService.storeProduct(formData, params.id, header).then(
        ({data}) => {
          toastr.success(data.message)
          goToList();
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
    
    if (!profiles.length) {
      getProfiles();
    }

    if (!sedes.length) {
      getSedes();
    }

    if (params.productoId) {
      getProductoInfo(params.productoId);
    }
  }, [] );
  
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
                    name={"sku"}
                    label="SKU"
                    rules={[{ required: true }]}
                  >
                    <Input className="input-padre" />
                  </Form.Item>
                </div>
                <div className="col-md-6">
                  <Form.Item
                    className="formulario__label"
                    name={"name"}
                    label="Descripción"
                    rules={[{ required: true }]}
                  >
                    <Input className="input-padre" />
                  </Form.Item>
                </div>
                <div className="col-md-6">
                  <Form.Item
                    className="formulario__label"
                    name={"price"}
                    label="Precio"
                    rules={[{ required: true }]}
                  >
                    <Input className="input-padre" />
                  </Form.Item>
                </div>
                <div className="col-md-6">
                  <Form.Item
                    className="formulario__label"
                    name={"talla"}
                    label="Tamaño"
                    rules={[{ required: true }]}
                  >
                    <Input className="input-padre" />
                  </Form.Item>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <Form.Item
                    className="formulario__label"
                    name={"color"}
                    label="Color"
                    rules={[{ required: true }]}
                  >
                    <Input className="input-padre" />
                  </Form.Item>
                </div>
                <div className="col-md-6">
                  <Form.Item
                    className="formulario__label"
                    name={"stock_quantity"}
                    label="Stock"
                    rules={[{ required: true }]}
                  >
                    <Input className="input-padre" />
                  </Form.Item>
                </div>
                <div className="col-md-6">
                  <Form.Item
                    className="formulario__label"
                    name={"image"}
                    label="Imagen"
                  >
                    <Input className="input-padre" />
                  </Form.Item>
                </div>
              </div>
              <div>
                { actImage ? (
                    <img
                        src={"http://localhost/tiendas/"+actImage}
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
                  name="imagen_boleta"
                  label="Foto del producto (jpg, png o jepg)"
                  valuePropName="fileList"
                  getValueFromEvent={normFile}
                >
                  <Upload name="logo" action="/upload.do" listType="picture">
                    <Button icon={<UploadOutlined />}>Subir foto</Button>
                  </Upload>
                </Form.Item>
              </div>
            </div>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ margin: "10px" }}>
                Guardar
              </Button>
              <NavLink to="/tienda/productos">
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
    getProfiles:  (values) => {
      dispatch(getProfiles(values));
    },
    getSedes:     (values) => {
      dispatch(getSedes(values));
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

export default connect(mapStateToProps, mapDispatchToProps)(ProductoForm);