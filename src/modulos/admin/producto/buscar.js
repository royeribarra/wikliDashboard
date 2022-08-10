import React, { useEffect, useState } from "react";
import { Form, Input, Select } from "antd";
import {
  Button,
  Card,
  CardBody,
  CardHeader
} from 'reactstrap';
import { CategoriaService } from "../../../servicios/categoriaService";

const { Option } = Select;
const Buscar = ({form, handleParentSearch}) => 
{
  const categoriaService = new CategoriaService("wiqli/categorias/todos");
  const [categorias, setCategorias] = useState([]);

  const pasarInfo = (event) => {
    event.preventDefault();
    handleParentSearch();
  }

  useEffect(() => {
    categoriaService.getTodos().then(({data})=> {
      setCategorias(data);
    });
  }, [])

  return (
    <Card className="filtro-producto" style={{ marginBottom: "15px" }}>
      <CardHeader>Buscar producto</CardHeader>
      <CardBody>
        <Form
          className="formulario"
          name="nest-messages"
          form={form}
          layout="vertical"
        >
          <div className="row">
            <div className="col-md-6">
              <Form.Item
                name="nombre"
                label="Nombre"
              >
                <Input className="input-padre" />
              </Form.Item>
            </div>
            <div className="col-md-6">
              <Form.Item
                tooltip="Modelo del producto"
                name="categoria_id"
                label="Categoría"
              >
                <Select>
                  <Option value="">Ninguno</Option>
                  {
                    categorias.map((categoria) => 
                    <Option value={categoria.id}>{categoria.nombre}</Option>
                    ) 
                  }
                </Select>
              </Form.Item>
            </div>
          </div>
          {' '}
          <Button onClick={pasarInfo}>Buscar</Button>
        </Form>
      </CardBody>
    </Card>
  );
};

export default Buscar;