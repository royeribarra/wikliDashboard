import {createStore, combineReducers, applyMiddleware} from "redux";
import { reducer as toastrReducer } from 'react-redux-toastr';
import logger from "redux-logger";
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";
// ***** REFUCERS *****
import user from "./reducers/userLogedReducer";
import spinner from "./reducers/spinnerReducer";
import userReducer from "./reducers/userReducer";
import routeReducer from "./reducers/routeReducer";
import { loaderReducer } from "./reducers/loaderReducer";
import { pedidoReducer } from "./reducers/pedidoReducer";

const reducer = combineReducers({   
    spinner,
    user,
    userReducer,
    routeReducer,
    toastr: toastrReducer,
    loader: loaderReducer,
    pedido: pedidoReducer
});

export default createStore(reducer, {},
    applyMiddleware(logger, thunk, promise)
);

