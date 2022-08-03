import React, { Fragment, useEffect, useState } from "react";
import { NavLink, useRouteMatch,  useHistory, useParams } from "react-router-dom";
import { Form, Input, Radio, Button, InputNumber } from "antd";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import { TiendaService } from "../../../servicios/tiendaService";
import { getProfiles, getSedes } from "../../../redux/actions/userActions";
import { updateMigas } from "../../../redux/actions/routeActions";
import ImageUploading from "react-images-uploading";
import ReactBnbGallery from "react-bnb-gallery";
import { Card, CardBody, CardHeader, Button as ButtonStrap } from "reactstrap";
import Page from 'components/Page';

// InputNumber
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

const DatosFacturacion = ({data, mandarTipoFee, mandarValorFee}) => {
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
    mandarTipoFee(data.codigo, e.target.value);
  }

  const onChangeInput = (e) => {
    mandarValorFee(data.codigo, e);
    setMonto(e);
  }

  useEffect(()=>{
    setTipo(data.tipo);
    setMonto(data.monto);
  }, [data]);

  return(
    <div className="col-md-4">
      <h6>{data.nombre}</h6>
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

const TiendaForm = ({ updateMigas }) => {
  const [form] = Form.useForm();
  const tiendaService = new TiendaService("stores");
  const { id } = useParams();
  const history = useHistory();
  const [image, setImage] = useState(null);
  const [actImage, setActImage] = useState("");
  
  const maxNumber = 1;
  const [galleryActiveIdx, setGalleryActiveIdx] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [imagesGallery, setImagesGallery] = useState([]);
  const [info, setInfo] = useState([]);
  const [infoFeeTienda, setInfoFeeTienda] = useState([]);
  const [feeTienda, setFeeTienda] = useState([
    {nombre: 'Fee devolución', codigo: 1, tipo: 1, monto: 0},
    {nombre: 'Fee cambio', codigo: 2, tipo: 1, monto: 0},
    {nombre: 'Fee upseeling', codigo: 3, tipo: 1, monto: 0}
  ]);
  const [latitud, setLatitud] = useState();
  const [longitud, setLongitud] = useState();
  
  const getTiendaInfo = () => {
    tiendaService.get(id).then(
      ({ data }) => {
        setInfo(data);
        data = { ...data, id };
        form.setFieldsValue(data);
        setFeeTienda(data.tienda_fee);
      },
      (err) => {
      }
    );
  };

  function goToList() {
    history.push("/admin/tiendas");
  }

  const onFinish = (values) => {
    const formData = new FormData();
    formData.append("latitud", latitud);
    formData.append("longitud", longitud);
    feeTienda.forEach(elemento => {
      formData.append('datosFee[]', JSON.stringify(elemento));
    });

    for (var key in values) {
      formData.append(key, values[key]);
    }

    images.forEach((image) => {
      if (image.file) {
        formData.append("img_url[]", image.file);
      }
    });

    tiendaService
      .store(formData, id, { "Content-Type": "multipart/form-data" })
      .then(
        ({data}) => {
          toastr.success(data.message)
          //goToList();
        },
        () => {}
      );
  };

  const openGallery = (index) => {
    setIsOpen(true);
    setGalleryActiveIdx(index);
  };

  const onFileChange = (event) => {
    const file = event.target.files[0];
    let img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
        setImage(file);
        setActImage(URL.createObjectURL(file));
      }
  };

  const onChangeImages = (imageList) => {
    setImages(imageList);
    const newImageList = imageList.map((image64Obj) => ({
      photo: image64Obj.data_url,
      caption: "no",
      thumbnail: image64Obj.data_url,
    }));

    setImagesGallery(newImageList);
  };

  const obtenerUbicacion = () => {
    if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        setLatitud(position.coords.latitude);
        setLongitud(position.coords.longitude);
      })
    }
  }

  const { url, path } = useRouteMatch();
  useEffect(() => {
    updateMigas(url) 
    if (id) {
      getTiendaInfo();
    }
  }, [] );

  const mandarTipoFee = (codigo, valor) => {
    let copyfeeTienda = feeTienda;
    let index = copyfeeTienda.findIndex(el=> el.codigo === codigo);
    copyfeeTienda[index].tipo = valor;
  }

  const mandarValorFee = (codigo, valor) => {
    let copyfeeTienda = feeTienda;
    let index = copyfeeTienda.findIndex(el=> el.codigo === codigo);
    copyfeeTienda[index].monto = valor;
  }

  const ListadoFee = feeTienda.map((item)=>
    <DatosFacturacion 
      key={item.codigo}
      data={item}
      mandarTipoFee={mandarTipoFee}
      mandarValorFee={mandarValorFee}
    />
  )
  
  return (
    <Page title="Tienda">
      <Card>
        
        <CardBody>
          <Form
            className="formulario"
            name="nest-messages"
            onFinish={onFinish}
            form={form}
            validateMessages={validateMessages}
            layout="vertical"
          >
            <div>
              <CardHeader>
                Información general
              </CardHeader>
              <CardBody>
                <div className="row">
                  <div className="col-md-4">
                    <Form.Item
                      className="formulario__label"
                      name={"business_name"}
                      label="Nombre de tienda"
                      rules={[{ required: true }]}
                    >
                      <Input className="input-padre" />
                    </Form.Item>
                  </div>
                  <div className="col-md-4">
                    <Form.Item
                      className="formulario__label"
                      name={"razon_social"}
                      label="Razón Social"
                      rules={[{ required: true }]}
                    >
                      <Input className="input-padre" />
                    </Form.Item>
                  </div>
                  <div className="col-md-4">
                    <Form.Item
                      className="formulario__label"
                      name={"ruc"}
                      label="RUC"
                      rules={[{ required: true }]}
                    >
                      <Input className="input-padre" />
                    </Form.Item>
                  </div>
                  <div className="col-md-4">
                    <Form.Item
                      className="formulario__label"
                      name={"departamento"}
                      label="Departamento"
                      rules={[{ required: true }]}
                    >
                      <Input className="input-padre" />
                    </Form.Item>
                  </div>
                  <div className="col-md-4">
                    <Form.Item
                      className="formulario__label"
                      name={"provincia"}
                      label="Provincia"
                      rules={[{ required: true }]}
                    >
                      <Input className="input-padre" />
                    </Form.Item>
                  </div>
                  <div className="col-md-4">
                    <Form.Item
                      className="formulario__label"
                      name={"distrito"}
                      label="Distrito"
                      rules={[{ required: true }]}
                    >
                      <Input className="input-padre" />
                    </Form.Item>
                  </div>
                  <div className="col-md-4">
                    <Form.Item
                      className="formulario__label"
                      name={"address"}
                      label="Dirección"
                      rules={[{ required: true }]}
                    >
                      <Input className="input-padre" />
                    </Form.Item>
                  </div>
                  <div className="col-md-4">
                    <Form.Item
                      className="formulario__label"
                      name={"email"}
                      label="Email"
                      rules={[{ required: true }]}
                    >
                      <Input className="input-padre" />
                    </Form.Item>
                  </div>
                  <div className="form-group col-md-4">
                    <Form.Item
                      className="formulario__label"
                      name={"state"}
                      label="Estado"
                      rules={[
                        {
                          required: true,
                          message: "Seleccione un estado!",
                        },
                      ]}
                    >
                      <Radio.Group className="mt-2">
                        <Radio value={1}>Activo</Radio>
                        <Radio value={0} className="ml-3">
                          Inactivo
                        </Radio>
                      </Radio.Group>
                    </Form.Item>
                  </div>
                  <div className="col-md-4">
                    <Form.Item
                      className="formulario__label"
                      label="Latitud"
                    >
                      <Input className="input-padre" />
                    </Form.Item>
                  </div>
                  <div className="col-md-4">
                    <Form.Item
                      className="formulario__label"
                      label="Longitud"
                    >
                      <Input className="input-padre" />
                    </Form.Item>
                  </div>
                </div>
              </CardBody>
            </div>
            <div>
              <CardHeader>
                Subir logo
              </CardHeader>
              <CardBody>
                <ImageUploading
                  className="images__wrapper"
                  multiple
                  value={images}
                  maxNumber={maxNumber}
                  dataURLKey="data_url"
                  onChange={onChangeImages}
                >
                  {({
                    imageList,
                    onImageUpload,
                    onImageRemove,
                    isDragging,
                    dragProps,
                  }) => (
                    <div className="figures">
                      <ButtonStrap
                        className="boton boton--transparent-azul figures__content-button--select"
                        type="button"
                        style={isDragging ? { color: "red" } : undefined}
                        onClick={onImageUpload}
                        {...dragProps}
                      >
                        <span className="icono icon-mas"></span>
                        Agregar Imagenes
                      </ButtonStrap>
                      <div className="figures__content">
                        {imageList.map((image, index) => (
                          <Fragment key={index}>
                            <div className="figures__images">
                              <div className="figures__images-wrapper">
                                <img
                                  className="figures__images-img"
                                  src={image["data_url"]}
                                  alt=""
                                  width="100"
                                />
                                <ButtonStrap
                                  className="figures__content-button figures__content-button--view"
                                  type="button"
                                  onClick={() => openGallery(index)}
                                >
                                  <span className=" icon-ojo">Ver</span>
                                </ButtonStrap>
                                <ButtonStrap
                                  className="figures__content-button figures__content-button--remove"
                                  type="button"
                                  onClick={() => onImageRemove(index)}
                                >
                                  <span className="icon-tacho">X</span>
                                </ButtonStrap>
                              </div>
                            </div>
                          </Fragment>
                        ))}
                      </div>
                      <ReactBnbGallery
                        show={isOpen}
                        activePhotoIndex={galleryActiveIdx}
                        photos={imagesGallery}
                        onClose={() => setIsOpen(false)}
                      />
                    </div>
                  )}
                </ImageUploading>
              </CardBody>
            </div>
            <div>
              <CardHeader>
                Datos Contacto
              </CardHeader>
              <CardBody>
                <div className="row">
                  <div className="col-md-4">
                    <Form.Item
                      className="formulario__label"
                      label="Nombres"
                      name={"nombre_contacto"}
                    >
                      <Input className="input-padre" />
                    </Form.Item>
                  </div>
                  <div className="col-md-4">
                    <Form.Item
                      className="formulario__label"
                      label="Apellidos"
                      name={"apellido_contacto"}
                    >
                      <Input className="input-padre" />
                    </Form.Item>
                  </div>
                  <div className="col-md-4">
                    <Form.Item
                      className="formulario__label"
                      label="Teléfono"
                      name={"telefono_contacto"}
                    >
                      <Input className="input-padre" />
                    </Form.Item>
                  </div>
                </div>
              </CardBody>
            </div>
            <div>
              <CardHeader>
                Datos Facturación     
              </CardHeader>
              <CardBody>
                <div className="row">
                {
                  ListadoFee
                }
                </div>
              </CardBody>
            </div>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ margin: "10px" }}>
                Guardar
              </Button>
              <NavLink to="/admin/tiendas">
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

export default connect(mapStateToProps, mapDispatchToProps)(TiendaForm);