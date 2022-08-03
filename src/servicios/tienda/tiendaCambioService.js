import axios from "axios";
import { MainService } from "../../servicios/mainService";

export class TiendaCambioService extends MainService {
  constructor(url) {
    super(url);
  }

  getAllErrors(){
   return axios.get(`${process.env.REACT_APP_BASE_PATH}/api/tienda/cambios-estandar/error/todos`, this.options);
  }

  aceptarCambio(gestionId, trackerId){
    return axios.get(`${process.env.REACT_APP_BASE_PATH}/api/tienda/cambios-estandar/aceptar-cambio/${gestionId}/${trackerId}`);
  }
  
  aceptarCambioErrorTienda(id){
    return axios.get(`${process.env.REACT_APP_BASE_PATH}/api/tienda/cambios/error/aceptar/${id}`, this.options);
  }

  denegarCambioErrorTienda(id){
    return axios.get(`${process.env.REACT_APP_BASE_PATH}/api/tienda/cambios/error/denegar/${id}`, this.options);
  }

  updateStateFromStore(id, tracker_cambio_estandar) {
    return axios.post(`${process.env.REACT_APP_BASE_PATH}/cambios-tienda/${id}`, tracker_cambio_estandar);
  }

  denied(id, motivo){
    return axios.post(`${process.env.REACT_APP_BASE_PATH}/denegar-cambio-estandar/${id}`, motivo);
  }
}