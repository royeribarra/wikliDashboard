import React, { Fragment, useState, useEffect } from "react";
import { NavLink, useRouteMatch } from "react-router-dom";
import "antd/dist/antd.css";
import { Table } from "antd";
import MaintananceServiceService from "../../../servicios/maintananceService";
import { connect } from "react-redux";
import { updateMigas } from "../../../redux/actions/routeActions";

const Mantenimientos = ({ updateMigas }) => {
  const maintananceSerService = new MaintananceServiceService(
    "maintenances/services" 
  );
  const maintananceSedeService = new MaintananceServiceService(
    "maintenances/sedes"
  );
  const { url, path } = useRouteMatch();
  
  const columnsServicio = [
    {
      title: "Nombre del servicio",
      dataIndex: "name",
      sorter: true,
      width: "25%",
    },
    {
      title: "Celular (whatsapp)",
      dataIndex: "phone",
    },
    {
      title: "Estado",
      dataIndex: "",
      render: (row) => {
        const { id, state } = row;
        return (
          <Fragment>
            {state ? (
              <button
                className="boton boton--verde boton-estado text-right"
                onClick={() => { changeStatusServices(id, state) }}
              >
                Activo
              </button>
            ) : (
              <button
                className="boton boton--plomo boton-estado text-right"
                onClick={() => { changeStatusServices(id, state) }}
              >
                Inactivo
              </button>
            )}
          </Fragment>
        );
      },
    },
    {
      title: "Editar",
      className: "text-center",
      dataIndex: "id",
      render: (id) => {
        return (
          <NavLink className="toggle__item" to={`/admin/mantenimientos/servicios/${id}`} >
            <span className="toggle__item-icono icono icon-editar m-auto"></span>
          </NavLink>
        );
      },
    },
  ];

  const columnsSedes = [
    {
      title: "Lugar",
      dataIndex: "name",
      sorter: true,
      width: "40%",
    },
    {
      title: "Estado",
      dataIndex: "",
      render: (row) => {
        const { id, state } = row;
        return (
          <Fragment>
            {state ? (
              <button
                className="boton boton--verde boton-estado text-right"
                onClick={() => {
                  changeStatusSedes(id, state);
                }}
              >
                Activo
              </button>
            ) : (
              <button
                className="boton boton--plomo boton-estado text-right"
                onClick={() => {
                  changeStatusSedes(id, state);
                }}
              >
                Inactivo
              </button>
            )}
          </Fragment>
        );
      },
    },
    {
      title: "Editar",
      dataIndex: "id",
      className: "text-center",
      render: (id) => {
        return (
          <NavLink className="toggle__item" to={`/admin/mantenimientos/sedes/${id}`} >
            <span className="toggle__item-icono icono icon-editar m-auto"></span>
          </NavLink>
        );
      },
    },
  ];

  const [rowsSedes, setRowsSedes] = useState([]);
  const [rowsServices, setRowsServices] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
  });

  const [loading] = useState(false);

  const handleTableChangeSedes = (values) => {
    const { current } = values;
    fetchAllSedes(current);
  };

  const changeStatusSedes = (id, state) => {
    const dataChangeStatus = {
      id,
      state,
    };
    maintananceSedeService.changeStatus(dataChangeStatus)
      .then(() => {
        fetchAllSedes(pagination.current);
      })
  };


  const changeStatusServices = (id, state) => {
    const dataChangeStatus = {
      id,
      state,
    };
    maintananceSerService.changeStatus(dataChangeStatus)
      .then(() => {
        fetchAllServices(pagination.current);
      })
  };


  const handleTableChangeServices = (values) => {
    const { current } = values;
    fetchAllServices(current);
  };

  useEffect(() => {
    updateMigas(url) 
    if (!rowsServices.length) {
      fetchAllServices();
    }
    if (!rowsSedes.length) {
      fetchAllSedes();
    }
  });

  const fetchAllServices = (pageCurrent) => {
    maintananceSerService.getAll(pageCurrent).then(({ data }) => {
      setPagination({
        ...pagination,
        current: data.current,
        total: data.total,
      });
      setRowsServices(data.data);
    });
  };

  const fetchAllSedes = (pageCurrent) => {
    maintananceSedeService.getAll(pageCurrent).then(({ data }) => {
      setPagination({
        ...pagination,
        current: data.current,
        total: data.total,
      });
      setRowsSedes(data.data);
    });
  };

  return (
    <Fragment>
      <section className="caja-contenedor">
        <div className="caja-contenedor__header caja-contenedor__header--separador row d-flex align-items-end">
          <h2 className="caja-contenedor__titulo col-6">Tipo de servicio</h2>
          <div className="col-6 text-right pb-2">
            <NavLink
              exact={false}
              to={`${path}/servicios/crear`}
              className="item__link boton  boton--transparent-azul "
            >
              <span className=" icono icon-mas"></span>
              Agregar
            </NavLink>
          </div>
        </div>
        <div className="caja-contenedor__body">
          <div className="row">
            <div className="col">
              <Table
                columns={columnsServicio}
                rowKey={(record) => record.id}
                dataSource={rowsServices}
                pagination={pagination}
                loading={loading}
                onChange={handleTableChangeServices}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="caja-contenedor caja-contenedor--ancho-mitad">
        <div className="caja-contenedor__header caja-contenedor__header--separador row d-flex align-items-end">
          <h2 className="caja-contenedor__titulo col-6">Sedes</h2>
          <div className="col-6 text-right pb-2">
            <NavLink
              exact={false}
              to={`${path}/sedes/crear`}
              className="item__link boton  boton--transparent-azul "
            >
              <span className=" icono icon-mas"></span>
              Agregar
            </NavLink>
          </div>
        </div>
        <div className="caja-contenedor__body">
          <div className="row">
            <div className="col">
              <Table
                columns={columnsSedes}
                rowKey={(record) => record.id}
                dataSource={rowsSedes}
                pagination={pagination}
                loading={loading}
                onChange={handleTableChangeSedes}
              />
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

const mapDispatchToProps = (dispatch)=>{
  return {
      updateMigas: (values) => {
      dispatch(updateMigas(values));
    },
  }
}
const mapStateToProps = (state) => {
  return {
  
  };
};

export default connect( mapStateToProps ,mapDispatchToProps) (Mantenimientos);
