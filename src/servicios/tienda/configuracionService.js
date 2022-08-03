import axios from "axios";
import { MainService } from "../../servicios/mainService";

export class ConfiguracionService extends MainService {
  constructor(url) {
    super(url);
  }

  store(body) {
    return axios.post(`${this.url}/tienda`, body, this.options);
  }

  update(id, body) {
    return axios.post(`${this.url}/tienda/${id}`, body, this.options);
  }

  get() {
    return axios.get(`${this.url}`, this.options);
  }

  getByTienda(id) {
    return axios.get(`${this.url}/tienda/${id}`, this.options);
  }

  getMotivos() {
    return axios.get(`${this.url}/general`, this.options);
  }
}