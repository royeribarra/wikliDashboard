import React from 'react';
import { withRouter } from "react-router-dom";
import AdminRoutes from "../../routes/adminRoutes";
import { connect } from "react-redux";

let Admin = () => {
  
    return (
        <AdminRoutes />
    )
}
const stateToProps = (state) => {
    const { display } = state.spinner
    return { spinnerDisplay: display }
}

export default connect(stateToProps)(withRouter(Admin));