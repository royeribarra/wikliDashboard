import React, { useEffect } from "react";
import { NavLink, useRouteMatch,  useHistory, useParams } from "react-router-dom";
import { Form, Input, DatePicker, InputNumber, Button } from "antd";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import { getProfiles, getSedes } from "../../../redux/actions/userActions";
import { updateMigas } from "../../../redux/actions/routeActions";
import { TuRepoService } from "../../../servicios/tuRepo/tuRepoService";
import Page from 'components/Page';
import { Card, CardBody, CardHeader } from 'reactstrap';

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

const CuponForm = ({ profiles, sedes, getProfiles, getSedes, updateMigas }) => {
  const productoService = new TuRepoService("tu-repo/cupon");
  const [form] = Form.useForm();
  const { id } = useParams();
  const history = useHistory();

  function goToList() {
    history.push("/admin/tu-repo/cupones");
  }

  const onFinish = (values) => {
    productoService.createCupon(values).then(({data}) => {
      toastr.success(data.message)
      goToList();
    });
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

  }, [] );
  
  return (
    <Page title="Información general del cupón">
      <Card>
        <CardHeader>
          Información general
        </CardHeader>
        <CardBody>
        <Form
          className="formulario"
          name="nest-messages"
          onFinish={onFinish}
          form={form}
          validateMessages={validateMessages}
          layout="vertical"
        >
          <div className="row">
            <div className="col-md-6">
              <Form.Item
                name={"codigo"}
                label="Código"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </div>
            <div className="col-md-3">
              <Form.Item
                name={"descuento"}
                label="Descuento (%)"
                rules={[{ required: true }]}
              >
                <InputNumber 
                  type="number" 
                  min={1} max={100000} 
                  step={0.1} 
                  placeholder="% 00.00"
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </div>
            <div className="col-md-3">
              <Form.Item
                name={"cantidad_total"}
                label="Cantidad"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item
                name={"fecha_inicio"}
                label="Fecha de inicio"
                rules={[{ required: true }]}
              >
                <DatePicker style={{ width: "100%"}} />
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item
                name={"fecha_expiracion"}
                label="Fecha de expiración"
                rules={[{ required: true }]}
              >
                <DatePicker style={{ width: "100%"}} />
              </Form.Item>
            </div>
          </div>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ margin: "10px" }}>
              Guardar
            </Button>
            <NavLink to="/admin/cupones">
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

export default connect(mapStateToProps, mapDispatchToProps)(CuponForm);