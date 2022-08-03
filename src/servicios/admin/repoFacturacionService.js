import axios from "axios";
import { MainService } from "../mainService";

export class RepoFacturacionService extends MainService {
  constructor(url) {
    super(url);
  }

  get() {
    return axios.get(`${this.url}`, this.options);
  }

  eliminarFacturacion(data, id) {
    return axios.post(`${this.url}/eliminar/${id}`, data, this.options);
  }

  agregarFacturacion(data, id) {
    return axios.post(`${this.url}/agregar/${id}`, data, this.options);
  }

  getFees(fechainicial, fechafinal, tienda_id) {
    return axios.get(`${this.url}/tienda/${tienda_id}/${fechainicial}/${fechafinal}`, this.options);
  }
}