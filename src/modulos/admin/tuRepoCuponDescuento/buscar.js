import React from "react";
import { Form, Input } from "antd";

const Buscar = ({form, titulo, handleParentSearch}) => {

  return (
    <section className="caja-contenedor">
      <div className="caja-contenedor__header caja-contenedor__header--separador mb-3 row d-flex align-items-center ">
        <h2 className="caja-contenedor__titulo col-12">{ titulo }</h2>
      </div>
      <div className="caja-contenedor__body">
        <Form
          className="formulario"
          name="nest-messages"
          form={form}
        >
          <div className="row">
            <div className="form-group col-3">
              <Form.Item
                className="formulario__label"
                name="sku_producto"
                label="SKU"
              >
                <Input className="input-padre" />
              </Form.Item>
            </div>
            <div className="form-group col-2">
              <Form.Item
                tooltip="Modelo del producto"
                className="formulario__label"
                name="sku_description"
                label="Descripción"
              >
                <Input className="input-padre" />
              </Form.Item>
            </div>
            <div className="form-group col d-flex align-items-center justify-content-end mt-3">
              <button className="boton boton--azul-tema" type="butoon" onClick={handleParentSearch}>
                <span className="icono icon-buscar"></span> Buscar
              </button>
            </div>
          </div>
        </Form>
      </div>
    </section>
  );
};

export default Buscar;