import axios from "axios";
import { MainService } from "../../servicios/mainService";

export class RepoCambioEstandarService extends MainService {
  constructor(url) {
    super(url);
  }

  createWayBill(gestionId, carrierId, body) {
    return axios.post(`${this.url}/create-waybill/${gestionId}/${carrierId}`, body, this.options);
  }

  generateCarrierWayBill(id, data, carrier) {
    return axios.post(`${this.url}/generate-carrier-waybill/${id}/${carrier.codigo}`, data, this.options);
  }

  createWayBill2(gestionId, body, carrierId) {
    return axios.post(`${this.url}/create-waybill/${gestionId}/${carrierId}`, body, this.options);
  }
}