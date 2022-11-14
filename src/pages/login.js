import React from "react";
import { Content } from '../components/Layout';
import logo2 from "../assets/img/repo.svg";
import { Spin, Form, Input } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import "../assets/styles/css/login.css";
import { connect } from 'react-redux';
import { login } from '../redux/actions/userLogActions';
import { toogleSpinner } from '../redux/actions/spinnerActions';
import { Card, Col, Row, Button, CardHeader } from 'reactstrap';

const LoginNew = (props) => {

  const onFinish = values => {
    props.toogleSpinner(true);
    props.login(values);
  };

  const onFinishFailed = (errorInfo) => {
  };

  return (
    <main className="cr-app bg-light">
      <Content fluid>
        <Spin className="spin__center" tip="Ahi vamos..." spinning={props.spinnerDisplay}>
          <Row
            style={{
              height: '100vh',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Col md={6} lg={4}>
              <CardHeader style={{textAlign: "center", border: "1px solid rgba(0, 0, 0, 0.125)"}}>Bienvenido Administrador</CardHeader>
              <Card body>
                <Form
                  className="form__login"
                  name="basic"
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed} 
                  layout="vertical"
                >
                  <div className="text-center pb-4">
                    <img
                      src="data:image/png;base64,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"
                      className="rounded"
                      style={{ width: 60, height: 60, cursor: 'pointer' }}
                      alt="logo"
                    />
                  </div>
                  <Form.Item
                    label="Correo Electrónico"
                    name="email"
                    className="texto texto--label"
                    rules={[
                      {
                        required: true,
                        message: "Por favor ingrese un correo electrónico válido",
                        type: "email",
                      },
                    ]}>
                    <Input className="input-padre" />
                  </Form.Item>
                  <Form.Item
                    label="Contraseña"
                    name="password"
                    className="texto texto--label"
                    rules={[
                      {
                        required: true,
                        message: "Por favor ingrese su contraseña",
                      },
                    ]}
                  >
                    <Input.Password 
                      className="input-padre"
                      iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)} />
                  </Form.Item>
                  <hr />
                  <Button
                    size="lg"
                    className="bg-gradient-theme-left border-0"
                    block
                  >
                    Login
                  </Button>
                </Form>
              </Card>
            </Col>
          </Row>
        </Spin>
      </Content>
    </main>
  );
};


const mapStateToProps = (state) => {
  return {
    spinnerDisplay: state.spinner.display
  }
}

const mapDispatchProps = (dispatch) => {
  return {
    login: (values) => {
      dispatch(login(values));
    },
    toogleSpinner: (display) => {
      dispatch(toogleSpinner(display));
    }
  }
}

export default connect(mapStateToProps, mapDispatchProps)(LoginNew);