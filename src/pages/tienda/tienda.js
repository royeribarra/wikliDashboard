import React from 'react';
import { withRouter } from "react-router-dom";
import TiendaRoutes from "../../routes/tiendaRoutes";
import { connect } from "react-redux";

let Tienda = () => {
  return (
    <TiendaRoutes />
  )
}
const stateToProps = (state) => {
  const { display } = state.spinner
  return { spinnerDisplay: display }
}

export default connect(stateToProps)(withRouter(Tienda));