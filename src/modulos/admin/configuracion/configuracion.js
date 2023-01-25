import React, { useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import { connect } from "react-redux";
import { Form, Input, Radio, InputNumber } from "antd";
import { ConfiguracionService } from "../../../servicios/configuracionService";
import { updateMigas } from "../../../redux/actions/routeActions";
import { Card, CardBody, CardHeader, Button } from "reactstrap";
import Page from '../../../components/Page';
import { toastr } from "react-redux-toastr";

const MontoDescuento = ({data, mandarTipoFee, mandarValorFee}) => {
  const [tipo, setTipo] = useState(1);
  const [monto, setMonto] = useState(0);
  const [formato, setFormato] = useState(`%`);
  const onChangeRadio = (e) => {
    if(e.target.value === 1){
      setFormato('%');
    }else if(e.target.value === 2){
      setFormato('');
    }
    setTipo(e.target.value);
    mandarTipoFee(e.target.value);
  }

  const onChangeInput = (e) => {
    mandarValorFee(e);
    setMonto(e);
  }

  useEffect(()=>{
    setTipo(data.tipo_descuento);
    setMonto(data.monto_descuento);
  }, [data]);

  return(
    <div>
      <h6>Monto de descuento</h6>
        <Radio.Group onChange={onChangeRadio} defaultValue={1} value={tipo}>
          <Radio value={1}>Variable</Radio>
          <Radio value={2}>Fijo</Radio>
        </Radio.Group>
        <InputNumber 
          formatter={value => `${value}${formato}`}
          defaultValue={0}
          value={monto}
          min={0}
          max={100}
          onChange={onChangeInput} 
        />
    </div>
  )
}

const Configuracion = ({ updateMigas }) => {
  const configuracionService = new ConfiguracionService("wiqli/configuracion");
  const { url } = useRouteMatch();
  const [form] = Form.useForm();
  const [configuracion, setConfiguracion] = useState(
    {
      id: 1,
      monto_descuento: 0.00, 
      monto_minimo_compra_referido: 0.00, 
      monto_minimo_envio_codigo: 0.00, 
      tipo_descuento: 1
    }
  );

  const getConfiguracionInfo = () => {
    configuracionService.getConfiguracion().then(({data}) => {
      
      setConfiguracion(data);
      form.setFieldsValue(data);
    });
  }

  const mandarTipoFee = (valor) => {
    const copyConf = configuracion;
    copyConf.tipo_descuento = valor;
    setConfiguracion(copyConf);
  }

  const mandarValorFee = (valor) => {
    const copyConf = configuracion;
    copyConf.monto_descuento = valor;
    setConfiguracion(copyConf);
  }

  const onFinish = (values) => {
    const newData = {};
    newData.monto_minimo_compra_referido = values.monto_minimo_compra_referido;
    newData.monto_minimo_envio_codigo = values.monto_minimo_envio_codigo;
    newData.monto_descuento = configuracion.monto_descuento;
    newData.tipo_descuento = configuracion.tipo_descuento;
    configuracionService.guardarConfiguracion(newData).then(({data})=> {
      if(data.state){
        toastr.success(data.message);
      }else{
        toastr.error("Algo salió mal, revisar.");
      }
    })
  }

  useEffect(() => {
    updateMigas(url);
    getConfiguracionInfo();
  }, []);

  return (
    <Page title="Configuración">
      <Card>
        <CardBody>
          <Form
            layout="vertical"
            form={form}
            onFinish={onFinish}
          >
            <div>
              <CardHeader>
                Cupones de descuento
              </CardHeader>
              <CardBody>
                <Form.Item
                  tooltip="Es el monto mínimo que el cliente debe comprar, para que al usuario se le envie un código que pueda 
                  compartir con sus conocidos y acceda a un descuento."
                  name={"monto_minimo_envio_codigo"}
                  label="Monto mínimo de compra para recibir un código de descuento"
                  rules={[{ required: true }]}
                >
                  <Input style={{ width: "auto" }} />
                </Form.Item>
                <Form.Item
                  tooltip="Es el monto mínimo que el cliente referido debe comprar, para que el cupón al que acceda sea válido."
                  name={"monto_minimo_compra_referido"}
                  label="Monto mínimo de compra del referido para acceder al cupón de descuento."
                  rules={[{ required: true }]}
                >
                  <Input style={{ width: "auto" }} />
                </Form.Item>
                <MontoDescuento
                  key={configuracion.id}
                  data={configuracion}
                  mandarTipoFee={mandarTipoFee}
                  mandarValorFee={mandarValorFee}
                />
              </CardBody>
            </div>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ margin: "10px" }}>
                Guardar
              </Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(Configuracion);
