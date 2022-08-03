import axios from "axios";
import { MainService } from "../../servicios/mainService";

export class EstadisticaService extends MainService {
  constructor(url) {
    super(url);
  }

  getDesgloseByTipoProceso(fechas) {
    let options = this.options;
    options.params = fechas;
    return axios.get(`${this.url}`, options);
  }

  getOrdenesTotales(fechas) {
    let options = this.options;
    options.params = fechas;
    return axios.get(`${this.url}`, options);
  }

  getEfectividadOrdenes(fechas) {
    let options = this.options;
    options.params = fechas;
    return axios.get(`${this.url}`, options);
  }

  getEstadoProcesos(fechas) {
    let options = this.options;
    options.params = fechas;
    return axios.get(`${this.url}`, options);
  }

  getMotivoProceso(fechas) {
    let options = this.options;
    options.params = fechas;
    return axios.get(`${this.url}`, options);
  }

  getMontoTotalTipoProceso(fechas) {
    let options = this.options;
    options.params = fechas;
    return axios.get(`${this.url}`, options);
  }

  getFechas(obj) {
    return axios.post(`${this.url}`, obj,this.options);
  }
}