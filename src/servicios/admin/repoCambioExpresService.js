import axios from "axios";
import { MainService } from "../../servicios/mainService";

export class RepoCambioExpresService extends MainService {
  constructor(url) {
    super(url);
  }

  createWayBill(id, carrier) {
    return axios.post(`${this.url}/recojo/create-waybill/${id}`, carrier, this.options);
  }

  createWayBill2(id, body) {
    return axios.post(`${this.url}/entrega/create-waybill/${id}`, body, this.options);
  }

  crearServicioLogisticoRecojo(gestionId, carrierId, body = {}){
    return axios.post(`${this.url}/recojo/olva/crear-servicio-logistico/${gestionId}/${carrierId}`, body, this.options);
  }

  crearServicioLogisticoEntrega(gestionId, carrierId, body = {}){
    return axios.post(`${this.url}/entrega/olva/crear-servicio-logistico/${gestionId}/${carrierId}`, body, this.options);
  }
}