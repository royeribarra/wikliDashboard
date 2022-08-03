import axios from "axios";
import { MainService } from "../../servicios/mainService";

export class TiendaCambioExpresService extends MainService {
  constructor(url) {
    super(url);
  }

  getAllErrors(){
   return axios.get(`${this.url}/pendientes/todos`, this.options);
  }

  aceptarCambioErrorTienda(id){
    return axios.post(`${process.env.REACT_APP_BASE_PATH}/cambios-expres/error/aceptar/${id}`);
  }

  denegarCambioErrorTienda(id){
    return axios.post(`${process.env.REACT_APP_BASE_PATH}/cambios-expres/error/denegar/${id}`);
  }

  createWayBill(id, carrier) {
    return axios.post(`${process.env.REACT_APP_BASE_PATH}/cambio-expres/${id}`, carrier);
  }

  createWayBill2(id, body) {
    return axios.post(`${process.env.REACT_APP_BASE_PATH}/cambio-expres/entrega/${id}`, body);
  }

  generateCarrierWayBill(id, data, carrier) {
    return axios.post(`${process.env.REACT_APP_BASE_PATH}/cambio-expres/generate-carrier-way-bill/${id}/${carrier.codigo}`, data);
  }

  generateCarrierWayBill2(id, data, carrier) {
    return axios.post(`${process.env.REACT_APP_BASE_PATH}/cambio-expres/generate-carrier-way-bill2/${id}/${carrier.codigo}`, data);
  }

  getCarriers(id){
    return axios.get(`${process.env.REACT_APP_BASE_PATH}/operadores-logisticos/${id}`, this.options);
  }

  updateStateFromStore(id, tracker_cambio_deluxe) {
    return axios.post(`${process.env.REACT_APP_BASE_PATH}/cambios-expres-tienda/${id}`, tracker_cambio_deluxe);
  }

  denied(id, motivo){
    return axios.post(`${this.url}/denegar-cambio/${id}`, motivo, this.options);
  }
}