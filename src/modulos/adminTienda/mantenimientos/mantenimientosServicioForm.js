import React, { useEffect } from "react";
import { Form, Input, Radio, Select } from "antd";
import { NavLink, useRouteMatch, useHistory, useParams } from "react-router-dom";
import MaintananceServiceService from "../../../servicios/maintananceService";
import { connect } from "react-redux";
import { updateMigas } from "../../../redux/actions/routeActions";
import { toastr } from "react-redux-toastr";

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
const { Option } = Select;


const prefixSelector = (
  <Form.Item 
    name="prefix" 
    noStyle>
    <Select defaultValue = {1} style={{ width: 70 }}>
      <Option value={1} selected>+51</Option>
      {/* <Option value="87">+87</Option> */}
    </Select>
  </Form.Item>
);



const MantenimientosServicioForm = ({ updateMigas }) => {
  const maintananceSerService = new MaintananceServiceService("maintenances/services");
  const history = useHistory();
  const { id } = useParams();
  const [form] = Form.useForm();
  const { url } = useRouteMatch();

  const goToList = () => {
    history.push("/admin/mantenimientos");
  }

  useEffect(() => {
    updateMigas(url); 
    if (id) {
      getMaintenanceInfo();
    }
  }, [])

  const mantenServicioCrearData = (values) => {
    values.id = id;
    maintananceSerService.store(values, id).then(
      ({data}) => {
        goToList();
        toastr.success(data.message)
      },
      () => {}
    );
  };

  const getMaintenanceInfo = () => {
    maintananceSerService.get(id)
      .then(({data}) => {
        data = { ...data, id, age: Number(data.age)};
        form.setFieldsValue(data)
      }, (err) => {
      })
  }

  return (
    <div className="caja-contenedor">
      <div className="caja-contenedor__header caja-contenedor__header--separador mb-3 row d-flex align-items-center ">
        <h2 className="caja-contenedor__titulo col-12">
          Agregar tipo de servicio
        </h2>
      </div>
      <div className="caja-contenedor__body">
        <Form
          className="formulario"
          name="nest-messages"
          form={form} 
          onFinish={mantenServicioCrearData}
          validateMessages={validateMessages}
        >
          <div className="row">
            <div className="form-group col-3">
              <Form.Item
                className="formulario__label"
                name="name"
                label="Nombre del servicio"
                rules={[{ required: true }]}
              >
                <Input className="input-padre" />
              </Form.Item>
            </div>
            <div className="form-group col-3">
              <Form.Item
                className="formulario__label"
                name="phone"
                label="Celular(Whatsapp)"
                rules={[
                  {
                    required: true,
                    message: "Porfavor ingrese un número de celular!",
                  },
                ]}
              >
                <Input
                  className="input-padre-celular"
                  addonBefore={prefixSelector}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </div>
            <div className="form-group col-3">
              <Form.Item
                className="formulario__label"
                name='alias'
                label="Alias"
                rules={[
                  {
                    required: true,
                    message: "Ingrese un alias",
                  },
                ]}
              >
                <Input className="input-padre" />
              </Form.Item>
            </div>
            <div className="form-group col-3">
              <Form.Item
                className="formulario__label"
                name='state'
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
                  <Radio className="ml-3" value={0}>
                    Inactivo
                  </Radio>
                </Radio.Group>
              </Form.Item>
            </div>
          </div>
          <div>
            <button className="boton boton--verde mr-3">
              <span
                className="icono icon-guardar-disquet"
                typeo="submit"
              ></span>{" "}
              Guardar
            </button>
            <NavLink className="boton boton--rojo"  to="/admin/mantenimientos">
             <span className="icono icon-regresar"></span> Cancelar
            </NavLink>
          </div>
        </Form>
      </div>
    </div>
  );
};

const mapDispatchToProps = (dispatch)=>{
  return {
      updateMigas: (values) => {
      dispatch(updateMigas(values));
    },
  }
}
const mapStateToProps = (state) => {
  return {};
};

export default connect( mapStateToProps ,mapDispatchToProps)(MantenimientosServicioForm);
