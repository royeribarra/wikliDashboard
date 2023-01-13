import React, { useState, useEffect } from "react";
import "./infoPedido.css";
import { Table, Form, InputNumber, DatePicker } from "antd";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter
} from 'reactstrap';
import { AdminPedidoService } from "../../../servicios/admin/adminPedidoService";

const RegistroPago = ({pedidoId, dataPedido}) => 
{
  const adminPedidoService = new AdminPedidoService("admin/pedido");
  const [formPago] = Form.useForm();
  const [rows, setRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };
  
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
  });
  const [loading] = useState(false);

  const registrarPago = (values) => {
    let params = {
      ...values,
      fechaPago: values['fechaPago'].format('YYYY-MM-DD'),
    };
    adminPedidoService.registrarPagoPedido(pedidoId, params).then(()=> {
      fetchAll();
      handleCancel()
    });
  };

  const fetchAll = (paginationTab = pagination) => {
    const searchObj = {
      page: paginationTab? paginationTab.current : 1
    }
    adminPedidoService.obtenerPagos(pedidoId).then(({ data }) => {
      setPagination({
        ...paginationTab,
        current: data.current,
        total: data.total,
      });
      setRows(data.data);
    });
  };

  let columns = [
    {
      title: "Numero",
      dataIndex: "id",
      render: (id) => {
        return (
          <p>{id}</p>
        );
      }
    },
    {
      title: "Monto",
      dataIndex: "monto",
      render: (monto) => {
        return (
          <p>S/ {monto}</p>
        );
      }
    },
    {
      title: "Fecha",
      dataIndex: "fechaPago",
      render: (fechaPago) => {
        return (
          <p>{fechaPago}</p>
        );
      }
    },
  ];

  useEffect(() => {
    if (!rows.length) {
      fetchAll();
    }
  }, []);

  return (
    <Card style={{ marginTop: "15px" }}>
      <CardHeader>
        Registro de Pagos
      </CardHeader>
      <CardBody>
        <Button style={{ marginBottom: "15px" }} onClick={showModal}>
          Agregar Pago
        </Button>
        <Modal
            isOpen={isModalOpen}
            toggle={showModal}
          >
          <ModalHeader toggle={handleCancel}>Registrar Pago</ModalHeader>
          <ModalBody>
          <Form
            form={formPago}
            name="basic"
            onFinish={registrarPago}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item 
              label="Monto"
              name="monto"
            >
              <InputNumber style={{ width: "100%" }} min={10.00} max={dataPedido.total - dataPedido.montoPagado} />
            </Form.Item>
            
            <Form.Item 
              label="Fecha Pago"
              name="fechaPago"
            >
              <DatePicker style={{ width: "100%" }} />
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
        <Table
          className="table-wiqli-antd"
          columns={columns}
          rowKey={(record) => record.id}
          dataSource={rows}
          pagination={pagination}
          loading={loading}
          onChange={fetchAll}
          bordered
        />
      </CardBody>
    </Card>
  );
};

export default RegistroPago;