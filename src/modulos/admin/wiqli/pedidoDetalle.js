import { Form, Input, InputNumber, Popconfirm, Table, Typography, Button, Select } from 'antd';
import React, { useEffect, useState, Fragment } from 'react';
import { PedidoService } from '../../../servicios/wiqli/pedidoService';
import { NavLink, useRouteMatch,  useHistory, useParams } from "react-router-dom";
import "./pedidoDetalle.css";
import { CardBody, Card, Button as ButtonReactStrap, CardHeader, Modal, ModalBody,
  ModalFooter,
  ModalHeader, } from 'reactstrap';
import Page from '../../../components/Page';
import 'antd/dist/antd.css';
import axios from "axios";
import InfoPedido from './infoPedido';
import {
  EditOutlined,
  SaveTwoTone,
  CloseCircleTwoTone
} from '@ant-design/icons';
import { toastr } from 'react-redux-toastr';
import { FiEdit } from "react-icons/fi";
import {  AiFillSave } from "react-icons/ai";
import { GiCancel} from "react-icons/gi";
import { DetallePedidoService } from '../../../servicios/wiqli/detallePedidoService';

const { Option } = Select;


const fetch = (value, callback) => {
  let timeout;
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  let currentValue = value;
  const consulta = () => {
    axios.get(`${process.env.REACT_APP_BASE_PATH}/wiqli/obtener-x-producto?nombre=${currentValue}`)
      .then((response) => {
        if (currentValue === value) {
          const { data } = response;
          callback(data);
        }
      });
  };
  timeout = setTimeout(consulta, 300);
};

const SearchInput = ({determinarProceso, placeholder, style}) => {
  const [data, setData] = useState([]);
  const [value, setValue] = useState();

  const handleSearch = (newValue) => {
    if (newValue) {
      fetch(newValue, setData);
    } else {
      setData([]);
    }
  };

  const handleChange = (newValue, data) => {
    setValue(newValue);
    determinarProceso(newValue, data);
  };

  const options = data.map((d) => <Option key={d.id} value={d.id} precio={d.precio_unitario}>{d.nombre}</Option>);
  return (
    <Select
      className="selectLanding-ant"
      showSearch
      value={value}
      placeholder={placeholder}
      style={style}
      defaultActiveFirstOption={false}
      showArrow={false}
      filterOption={false}
      onSearch={handleSearch}
      onChange={handleChange}
      notFoundContent={null}
    >
      {options}
    </Select>
  );
};

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const PedidoDetalle = () => {
  const pedidoService = new PedidoService("wiqli/pedido");
  const detallePedidoService = new DetallePedidoService("wiqli/detalle-pedido");
  const { pedidoId } = useParams();
  const [form] = Form.useForm();
  const [formProducto] = Form.useForm();
  const [data, setData] = useState([]);
  const [dataPedido, setDataPedido] = useState();
  const [idProducto, setIdProducto] = useState(0);
  const [existeProducto, setExisteProducto] = useState(true);
  const [editingKey, setEditingKey] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const isEditing = (record) => record.id === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      id: record.id,
      producto: record.producto,
      nombre_desc: record.nombre_desc,
      cantidad: record.cantidad,
      cantidad_desc: record.cantidad_desc,
      precio_unitario: record.precio_unitario,
      total: record.total,
      ...record,
    });
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (detalle) => {
    try {
      const row = await form.validateFields();
      pedidoService.updateDetalle(row, detalle.id).then(({data}) => {
        obtenerInformacionPedidoId();
        obtenerPedidoId();
        toastr.success(data.message)
      });
      const newData = [...data];
      const index = newData.findIndex((item) => detalle.id === item.id);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const changeStatusPedido = (id) => {
    pedidoService.updateStateDetalle(id).then(({data}) => {
      toastr.success(data.message);
      pedidoService.get(pedidoId).then(
        ({ data }) => {
          obtenerInformacionPedidoId();
          setData(data);
        },
          (err) => {
        }
        );
    });
  }

  const eliminarDetallePedido = (id) => {
    detallePedidoService.eliminarDetallePedido(id).then(({data})=> {
      obtenerInformacionPedidoId();
      obtenerPedidoId();
      setData(data);
    });
  };

  const columns = [
    {
      title: 'Producto',
      dataIndex: 'producto',
      render: (producto, row) => {
        return(
          <p>{producto? producto.nombre : row.nombre_desc}</p>
        );
      },
      editable: true,
    },
    {
      title: 'Cantidad',
      dataIndex: 'cantidad',
      width: 120,
      editable: true,
      render: (cantidad, row) => {
        return(
          <p>{cantidad? cantidad : row.cantidad_desc}</p>
        );
      },
    },
    {
      title: 'Precio unitario',
      dataIndex: 'precio_unitario',
      width: 100,
      editable: true,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      width:100,
      editable: true,
    },
    {
      title: 'Acción',
      dataIndex: 'operation',
      width:140,
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <>
            <ButtonReactStrap
              title="Guardar"
              color="primary"
              onClick={() => save(record)}
              style={{
                marginRight: 8,
              }}
            >
              <AiFillSave />
            </ButtonReactStrap>
            <Popconfirm title="¿Cancelar operación?" onConfirm={cancel}>
              <ButtonReactStrap title="Cancelar" color="danger"><GiCancel /></ButtonReactStrap>
            </Popconfirm>
          </>
        ) : (
          <ButtonReactStrap color="warning" disabled={editingKey !== ''} onClick={() => edit(record)} title="Editar">
            <FiEdit />
          </ButtonReactStrap>
        );
      },
    },
    {
      title: "Estado",
      dataIndex: "",
      width: 120,
      render: (row) => {
        const { id, status } = row;
        return (
          <Fragment>
            {status > 0 ? (
              <ButtonReactStrap
                color="success"
                className="boton boton--verde boton-estado text-right"
                onClick={() => {
                  changeStatusPedido(id);
                }}
              >
                Activo
              </ButtonReactStrap>
            ) : (
                <ButtonReactStrap
                  color="danger"
                  className="boton boton--plomo boton-estado text-right"
                  onClick={() => {
                    changeStatusPedido(id);
                  }}
                >
                  Inactivo
                </ButtonReactStrap>
              )}
          </Fragment>
        );
      },
    },
    {
      title: "Eliminar",
      dataIndex: "",
      width: 120,
      render: (row) => {
        const { id, status } = row;
        return (
          <Fragment>
            <ButtonReactStrap
              color="danger"
              onClick={() => {
                eliminarDetallePedido(id);
              }}
            >
              Eliminar
            </ButtonReactStrap>
          </Fragment>
        );
      },
    }
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'cantidad' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const obtenerPedidoId = () => {
    pedidoService.get(pedidoId).then(
      ({ data }) => {
        setData(data);
      },
        (err) => {
      }
    );
  }

  const obtenerInformacionPedidoId = () => {
    pedidoService.getInformacionPedido(pedidoId).then(
      ({ data }) => {
        setDataPedido(data);
      },
        (err) => {
      }
    );
  }

  useEffect(() => {
    obtenerPedidoId();
    obtenerInformacionPedidoId();
  }, [])

  const onFinish = (values) => {
    existeProducto ? values.producto = '' : values.producto = 'Otro producto';
    pedidoService.agregarProductoDetalle(pedidoId, idProducto, values).then(({data}) => {
      if(data.state){
        handleCancel();
        obtenerPedidoId();
        obtenerInformacionPedidoId();
      }
    });
  };

  const obtenerProducto = (e, data) => {
    setIdProducto(data.key);
    if(data.children !== "Otro producto"){
      formProducto.setFieldsValue({
        precio_unitario: data.precio
      });
      setExisteProducto(true);
    }else if(data.children === "Otro producto"){
      setExisteProducto(false);
    }
  }

  return (
    <Page title="Información general">
      {
        dataPedido && <InfoPedido data={dataPedido} obtenerInformacionPedidoId={obtenerInformacionPedidoId} />
      }
      
      <Card>
        <CardBody>
          <ButtonReactStrap color="primary" onClick={showModal} style={{ marginBottom: "20px" }}>
            Agregar producto
          </ButtonReactStrap>
          <Modal
            isOpen={isModalOpen}
            toggle={showModal}
          >
            <ModalHeader toggle={handleCancel}>Agregar producto</ModalHeader>
            <ModalBody>
            <Form
              form={formProducto}
              name="basic"
              onFinish={onFinish}
              autoComplete="off"
              layout="vertical"
            >
              <Form.Item 
                name="producto_id" 
                label="Buscar producto"
                className="selector-tienda"
              >
                <SearchInput
                  placeholder="Escribe el producto"
                  determinarProceso={obtenerProducto}
                />
              </Form.Item>
              {
                !existeProducto &&
                <>
                  <Form.Item
                    label="Nombre del producto"
                    name="nombre_desc"
                    rules={[
                      {
                        required: true,
                        message: 'Por favor ingresa un nombre!',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item 
                    label="Cantidad"
                    name="cantidad_desc"
                    rules={[
                      {
                        required: true,
                        message: 'Por favor ingresa una cantidad!',
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </> 
              }
              {
                existeProducto &&
                <Form.Item 
                  label="Cantidad"
                  name="cantidad"
                >
                  <InputNumber style={{ width: "100%" }} />
                </Form.Item>
              }
              
              <Form.Item 
                label="Precio unitario"
                name="precio_unitario"
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
              <ModalFooter>
                <Form.Item
                >
                  <Button type="primary" htmlType="submit">
                  Guardar
                  </Button>
                </Form.Item>
                <Form.Item
                >
                  <Button type="primary" danger onClick={handleCancel}>
                    Cancelar
                  </Button>
                </Form.Item>
              </ModalFooter>
            </Form>
            </ModalBody>
            
          </Modal>
          <Form form={form} component={false}>
            <Table
              className="table-wiqli-antd"
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              bordered
              dataSource={data}
              columns={mergedColumns}
              rowClassName="editable-row"
              pagination={{
                onChange: cancel,
              }}
              scroll={{ x: 800 }}
            />
          </Form>
        </CardBody>
      </Card>
    </Page>
  );
};

export default PedidoDetalle;