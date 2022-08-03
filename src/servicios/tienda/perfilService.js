import axios from "axios";
import { MainService } from "../../servicios/mainService";

export class PerfilService extends MainService {
  constructor(url) {
    super(url);
  }

  update(id, body) {
    return axios.post(`${this.url}/${id}`, body, this.options);
  }

  get() {
    return axios.get(`${this.url}`, this.options);
  }
}