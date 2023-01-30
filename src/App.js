import React from 'react';
import MainRoutes from "./routes/mainRoutes";
import './styles/reduction.scss';
import { Provider } from "react-redux";
import store from "./redux/store";
import ReduxToastr from "react-redux-toastr";
import "react-redux-toastr/lib/css/react-redux-toastr.min.css";

function App(){
  
  return (
    <Provider store={store}>
      <MainRoutes />
      <ReduxToastr
        className="toastr__modificar"
        timeOut={4000}
        newestOnTop={false}
        preventDuplicates
        position="top-right"
        getState={(state) => state.toastr}
        transitionIn="fadeIn"
        transitionOut="fadeOut"
        progressBar
        closeOnToastrClick
      />
    </Provider>
  );
}

export default App;