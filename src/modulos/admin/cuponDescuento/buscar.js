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
      <CardHeader>Buscar cupón</CardHeader>
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
                name="codigo"
                label="Código"
              >
                <Input className="input-padre" />
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