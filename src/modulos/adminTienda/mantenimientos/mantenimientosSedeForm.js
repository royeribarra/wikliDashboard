import React, { useEffect } from "react";
import { Form, Input, Radio } from "antd";
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

const MantenimientosSedeForm = ({ updateMigas }) => {
  const maintananceSedeService = new MaintananceServiceService("maintenances/sedes");
  const [form] = Form.useForm();
  const { id } = useParams();
  const history = useHistory();
  const { url } = useRouteMatch();

  useEffect(() => {
    updateMigas(url); 
    if (id) {
      getMaintenanceInfo();
    }
  })

  const getMaintenanceInfo = () => {
    maintananceSedeService.get(id)
      .then(({data}) => {
        data = { ...data, id, age: Number(data.age)};
        form.setFieldsValue(data)
      }, (err) => {
       
      })
  }

  function goToList() {
    history.push("/admin/mantenimientos");
  }

  const mantenSedeCrearData = (values) => {
    maintananceSedeService.store(values, id).then(
      ({data}) => {
        goToList();
        toastr.success(data.message)
      },
      () => {}
    );
  };

  return (
    <div className="caja-contenedor">
      <div className="caja-contenedor__header caja-contenedor__header--separador mb-3 row d-flex align-items-center ">
        <h2 className="caja-contenedor__titulo col-12">
          Agregar sede
        </h2>
      </div>
      <div className="caja-contenedor__body">
        <Form
          className="formulario"
          name="nest-messages"
          form={form} 
          onFinish={mantenSedeCrearData}
          validateMessages={validateMessages}
        >
          <div className="row">
            <div className="form-group col-4">
              <Form.Item
                className="formulario__label"
                name='name'
                label="Nombre de la nueva sede"
                rules={[{ required: true }]}
              >
                <Input className="input-padre" />
              </Form.Item>
            </div>
            <div className="form-group col">
              <Form.Item
                className="formulario__label"
                name='state'
                label="Estado"
                rules={[
                  {
                    required: true
                  }
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
              ></span>
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
  return {
  
  };
};


export default  connect( mapStateToProps ,mapDispatchToProps) (MantenimientosSedeForm);
