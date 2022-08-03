import React, { useEffect, useState } from "react";
import { useRouteMatch, NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { Form, Input, Button } from "antd";
import { PerfilService } from "../../../servicios/tienda/perfilService";
import { updateMigas } from "../../../redux/actions/routeActions";
import { toastr } from "react-redux-toastr";
import Page from '../../../components/Page';
import {
  Card,
  CardBody,
  CardHeader
} from 'reactstrap';

const Perfil = ({ updateMigas }) => {
  const service = new PerfilService("perfil");
  const { url, path } = useRouteMatch();
  const [form] = Form.useForm();
  const [id, setId] = useState();
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
  });
  const [loading] = useState(false);

  const onFinish = (values) => {
    if(id){
        service.update(id, values).then(({data}) => {
        toastr.success(data.message)
      });
    }else{
        service.store(values).then((response) => {
      });
    }
  }

  const getPerfilInfo = () => {
    service.get().then(({ data }) => {
      form.setFieldsValue(data);
      if(data){
        setId(data.id);
      }
    });
  };

  useEffect(() => {
    updateMigas(url);
    getPerfilInfo();
  }, []);

  return (
    <Page title="Perfil">
      <Card>
        <CardHeader>
          Perfil
        </CardHeader>
        <CardBody>
          <Form
            className="formulario"
            name="nest-messages"
            form={form}
            onFinish={onFinish}
            layout="vertical"
          >
            <div className="caja-contenedor__body mt-2">
              <div className="row">
                <div className="col-md-6">
                  <Form.Item
                    className="formulario__label"
                    name={"name"}
                    label="Nombres"
                  >
                    <Input />
                  </Form.Item>
                </div>
                <div className="col-md-6">
                  <Form.Item
                    name={"father_lastname"}
                    label="Apellidos"
                  >
                    <Input />
                  </Form.Item>
                </div>
                  <div className="col-md-6">
                    <Form.Item
                      name={"email"}
                      label="Email"
                    >
                      <Input disabled />
                    </Form.Item>
                  </div>
                  <div className="col-md-6">
                    <Form.Item
                      name={"phone"}
                      label="Teléfono"
                    >
                      <Input />
                    </Form.Item>
                  </div>
                  <div className="col-md-6">
                    <Form.Item
                      name={"dni"}
                      label="DNI"
                    >
                      <Input />
                    </Form.Item>
                  </div>
              </div>
              <div>
                <CardHeader>
                  Cambio de contraseña
                </CardHeader>
                <CardBody>
                  <div className="row">
                    <div className="col-md-6">
                      <Form.Item
                        name={"password"}
                        label="Contraseña anterior"
                      >
                        <Input.Password />
                      </Form.Item>
                    </div>
                    {/* <div className="col-md-6">
                      <Form.Item
                        name={"new_password"}
                        label="Nueva contraseña"
                      >
                        <Input.Password />
                      </Form.Item>
                    </div> */}
                  </div>
                </CardBody>
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
    updateMigas: (values) => {
      dispatch(updateMigas(values));
    },
  };
};
const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Perfil);