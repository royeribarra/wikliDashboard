import React from "react";
import "antd/dist/antd.css";
import { Form, Input, Select, InputNumber } from "antd";
import { useEffect } from "react";
import { useState } from "react";
import { UserService } from "../../../servicios/userService";
import { Card, CardBody, CardHeader, Button } from "reactstrap";

const { Option } = Select;

const Buscar = ({form, handleParentSearch}) => {
  const userService = new UserService("users");
  let [roles, setRoles] = useState([]);

  const getRoles = () => {
    userService.getProfiles().then(({data}) => {
      setRoles(data)
    })
  }

  useEffect(() => {
    getRoles();
  }, []);

  const pasarInfo = (event) => {
    event.preventDefault();
    handleParentSearch();
  }

  return (
    <Card style={{ marginBottom: "15px"}}>
      <CardHeader>
        Buscar usuario
      </CardHeader>
      <CardBody>
        <Form
          className="formulario"
          name="nest-messages"
          form={form}
          layout="vertical"
        >
          <div className="row">
            <div className="form-group col-md-6">
              <Form.Item
                name="fullname"
                label="Nombres y Apellidos"
              >
                <Input />
              </Form.Item>
            </div>
            <div className="form-group col-md-6">
              <Form.Item
                name="dni"
                label="DNI"
              >
                <InputNumber style={{ width: "100%" }}/>
              </Form.Item>
            </div>
            <div className="form-group col-md-6">
              <Form.Item
                name="sede_id"
                label="Cargo"
              >
                <Select className="select-padre" placeholder="Seleccione un perfil">
                  { roles.filter((profile) => profile.id !== 4)
                    .map( profile => (
                      <Option value={profile.id} key={profile.id}> {profile.name}</Option>
                    ))
                  }
              </Select>
              </Form.Item>
            </div>
          </div>
          <Button onClick={pasarInfo}>Buscar</Button>
        </Form>
      </CardBody>
    </Card>
  );
};

export default Buscar;
