import { Form, Input, InputNumber, Popconfirm, Table, Typography } from 'antd';
import React, { useEffect, useState, Fragment } from 'react';
import { PedidoService } from '../../../servicios/wiqli/pedidoService';
import { NavLink, useRouteMatch,  useHistory, useParams } from "react-router-dom";
import "./pedidoDetalle.css";
import { CardBody, Card, Button as ButtonReactStrap } from 'reactstrap';
import Page from '../../../components/Page';

const originData = [];

for (let i = 0; i < 100; i++) {
  originData.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}

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
  const { pedidoId } = useParams();
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record) => record.id === editingKey;

  const edit = (record) => {
    console.log(record)
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
      console.log(detalle)
      console.log(row)
      pedidoService.updateDetalle(row, detalle.id).then(({data}) => {
        console.log(data);
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
    pedidoService.updateStateDetalle(id).then(() => {
      pedidoService.get(pedidoId).then(
        ({ data }) => {
          console.log(data)
          setData(data);
        },
          (err) => {
        }
        );
    });
  }

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
      editable: true,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      editable: true,
    },
    {
      title: 'Acción',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record)}
              style={{
                marginRight: 8,
              }}
            >
              Guardar
            </Typography.Link>
            <Popconfirm title="¿Cancelar operación?" onConfirm={cancel}>
              <a>Cancelar</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Editar
          </Typography.Link>
        );
      },
    },
    {
      title: "Estado",
      dataIndex: "",
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

  useEffect(() => {
    pedidoService.get(pedidoId).then(
    ({ data }) => {
      console.log(data)
      setData(data);
    },
      (err) => {
    }
    );
  }, [])

  return (
    <Page title="Información general">
      <Card>
        <CardBody>
          <Form form={form} component={false}>
            <Table
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
            />
          </Form>
        </CardBody>
      </Card>
    </Page>
  );
};

export default PedidoDetalle;