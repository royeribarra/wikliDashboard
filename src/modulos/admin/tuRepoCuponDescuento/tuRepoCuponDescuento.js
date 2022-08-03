import React, { useEffect, useState } from "react";
import { NavLink, useRouteMatch } from "react-router-dom";
import { connect } from "react-redux";
import { Table, Form, InputNumber, Input } from "antd";
import { TuRepoService } from "../../../servicios/tuRepo/tuRepoService";
import { updateMigas } from "../../../redux/actions/routeActions";
import DeleteCupon from "./deleteCupon";
import Page from 'components/Page';
import { Card, CardBody, CardHeader, Button as ButtonStrap } from 'reactstrap';

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
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const TuRepoCuponDescuento = ({ updateMigas }) => {
  const productoService = new TuRepoService("tu-repo/cupones-descuento/todos");
  const { url, path } = useRouteMatch();
  const [form] = Form.useForm();
  const [showDelModal, setShowDelModal] = useState(false);
  const [activeRow, setActiveRow] = useState({});

  let columns = [
    {
      title: "Código",
      dataIndex: "codigo",
      sorter: true
    },
    {
      title: "Fecha inicio",
      dataIndex: "fecha_inicio",
      sorter: true
    },
    {
      title: "Fecha expiración",
      dataIndex: "fecha_expiracion",
      sorter: true
    },
    {
      title: "Cantidad total",
      dataIndex: "cantidad_total",
      sorter: true
    },
    {
      title: "Cantidad usada",
      dataIndex: "cantidad_usada",
      sorter: true
    },
    {
      title: "Cantidad restante",
      dataIndex: "cantidad_restante",
      sorter: true
    },
  ];

  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
  });
  const [loading] = useState(false);


  const fetchAll = (paginationTab = pagination) => {
    const values = form.getFieldsValue();
    const searchObj = {
      ...values,
      page: paginationTab? paginationTab.current : 1
    }

    productoService.getAll(searchObj).then(({ data }) => {
      setPagination({
        ...paginationTab,
        current: paginationTab.current,
        total: data.total,
      });
      setRows(data.data);
    });
  };

  const deleteRecord = (id, row) => {
    setActiveRow(row);
    setShowDelModal(true);
  };

  useEffect(() => {
    updateMigas(url);

    if (!rows.length) {
      fetchAll();
    }
  }, []);

  return (
    <Page title="Tu Repo - Cupones de Descuento">
      <Card>
        <CardHeader>
          Lista de cupones
        </CardHeader>
        <CardBody>
          <NavLink
            exact={false}
            to={`cupon/crear`}
          >
            <ButtonStrap style={{ marginBottom: "10px" }}>Crear Cupon</ButtonStrap>
          </NavLink>
          <div>
            <Table
              columns={columns}
              rowKey={(record) => record.id}
              dataSource={rows}
              pagination={pagination}
              loading={loading}
              onChange={fetchAll}
              bordered
              scroll={{ x: 1200}}
            />
            <DeleteCupon 
              status={showDelModal}
              handleClose={setShowDelModal}
              handleRefreshTable={fetchAll}
              activeRow={activeRow}
            />
          </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(TuRepoCuponDescuento);