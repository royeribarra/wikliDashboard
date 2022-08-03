import React, { useEffect, useState } from "react";
import { NavLink, useRouteMatch,  useHistory, useParams } from "react-router-dom";
import { Form, Input, Select, Radio, Button } from "antd";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { UserService } from "../../../servicios/userService";
import { TiendaService } from "../../../servicios/tiendaService";
import { getProfiles, getSedes } from "../../../redux/actions/userActions";
import { updateMigas } from "../../../redux/actions/routeActions";
import { Card, CardBody } from "reactstrap";
import Page from 'components/Page';

// InputNumber
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

const UsuarioForm = ({ profiles, sedes, getProfiles, getSedes, updateMigas }) => {
  const [tiendas, setTiendas] = useState();
  const [form] = Form.useForm();
  const userService = new UserService("users");
  const tiendaService = new TiendaService("stores");
  const { usuarioId } = useParams();
  const history = useHistory();

  const getUserInfo = () => {
    userService.get(usuarioId).then(
      ({ data }) => {
        data = { ...data, usuarioId };
        form.setFieldsValue(data);
      },
      (err) => {
      }
    );
  };

  const getTiendas = () => {
    tiendaService.getAllSimple().then(({data}) => {
      setTiendas(data);
    })
  };

  function goToList() {
    history.push("/admin/usuarios");
  }

  const onFinish = (values) => {
    userService.store(values, usuarioId).then(
      ({data}) => {
        toastr.success(data.message)
        goToList();
      },
      () => {}
    );
  };

  const { url, path } = useRouteMatch();
  useEffect(() => {
    updateMigas(url) 
    
    if (!profiles.length) {
      getProfiles();
    }

    if (!sedes.length) {
      getSedes();
    }

    if (usuarioId) {
      getUserInfo();
    }
    getTiendas();
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
            <div>
              <div className="row">
                <div className="col-md-4">
                  <Form.Item
                    name={"name"}
                    label="Nombres"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </div>
                <div className="col-md-4">
                  <Form.Item
                    name={"father_lastname"}
                    label="Apellidos"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </div>
                <div className="col-md-4">
                  <Form.Item
                    name={"dni"}
                    label="DNI"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </div>
              
              </div>
              <div className="row">
                <div className="form-group col-md-4">
                  <Form.Item
                    name={"rol_id"}
                    label="Perfil"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Select className="select-padre" placeholder="Seleccione un perfil">
                      { profiles.filter((profile) => profile.id !== 4)
                        .map( profile => (
                          <Option value={profile.id} key={profile.id}> {profile.name}</Option>
                        ))
                      }
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-md-4">
                  <Form.Item
                    name={"tienda_id"}
                    label="Tienda"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Select className="select-padre" placeholder="Seleccione una tienda">
                      <Option value={0} key="repo">Ninguna</Option>
                      { tiendas && tiendas.map( tienda => (
                          <Option value={tienda.id} key={tienda.id}> {tienda.business_name}</Option>
                        ))
                      }
                    </Select>
                  </Form.Item>
                </div>
                <div className="col-md-4">
                  <Form.Item
                    name={"phone"}
                    label="Celular"
                    rules={[
                      {
                        required: true,
                        message: "Porfavor ingrese un número de celular!",
                      },
                    ]}
                  >
                    <Input
                      style={{ width: "100%" }}
                    />
                  </Form.Item>
                </div>

                <div className="col-md-4">
                  <Form.Item
                    name={"state"}
                    label="Estado"
                    rules={[
                      {
                        required: true,
                        message: "Please input your phone number!",
                      },
                    ]}
                  >
                    <Radio.Group className="mt-2">
                      <Radio value={1}>Activo</Radio>
                      <Radio value={0} className="ml-3">
                        Inactivo
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                </div>
              </div>
            </div>

            <div>
              <h2>
                Información de Registro
              </h2>
            </div>
            <div className="row">
              <div className="col-md-6">
                <Form.Item
                  label="Correo electrónico"
                  name={"email"}
                  rules={[
                    {
                      type: "email",
                      message: "El correo enviado no es válido",
                    },
                    {
                      required: true,
                      message: "Correo es requerido!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item
                  label={usuarioId ? "Nueva Contraseña" : "Contraseña"}
                  name={"password"}
                  rules={[
                    {
                      required: usuarioId ? false : true,
                      message: "Por favor ingrese su contraseña",
                    },
                  ]}
                >
                  <Input.Password
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                  />
                </Form.Item>
              </div>
            </div>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ margin: "10px" }}>
                Guardar
              </Button>
              <NavLink to="/admin/usuarios">
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

export default connect(mapStateToProps, mapDispatchToProps)(UsuarioForm);