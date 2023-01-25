import React, { useEffect, useState } from "react";
import { NavLink, useRouteMatch,  useHistory, useParams } from "react-router-dom";
import { Form, Input, Button, Select } from "antd";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import { ProductoService } from "../../../servicios/productoService";
import { updateMigas } from "../../../redux/actions/routeTiendaActions";
import Page from '../../../components/Page';
import {
  Card,
  CardBody
} from 'reactstrap';

const { Option } = Select;

const ProductoExternoForm = ({ updateMigas }) => {
  const [form] = Form.useForm();
  const productoService = new ProductoService("wiqli/producto-scrapeado");
  const productoWiqliService = new ProductoService("wiqli/productos");
  //const { id } = useParams();
  const params = useParams();
  const history = useHistory();
  const [productosWiqli, setProductosWiqli] = useState([]);

  const getProductoInfo = (id) => {
    productoService.get(id).then(
      ({ data }) => {
        data = { ...data, id };
        form.setFieldsValue(data);
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