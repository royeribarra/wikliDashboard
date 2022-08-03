import axios from "axios";
import { MainService } from "../../servicios/mainService";

export class RepoDevolucionService extends MainService {
  constructor(url) {
    super(url);
  }

  createWayBill(id, body) {
    return axios.post(`${this.url}/create-waybill/${id}`, body, this.options);
  }

  generateCarrierWayBill(id, data, carrier) {
    return axios.post(`${this.url}/generate-carrier-waybill/${id}/${carrier.codigo}`, data, this.options);
  }
}