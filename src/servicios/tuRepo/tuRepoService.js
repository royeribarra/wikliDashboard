import axios from "axios";
import { MainService } from "../../servicios/mainService";

export class TuRepoService extends MainService {
  constructor(url) {
    super(url);
  }

  getServices() {
    return axios.get(`${this.url}/servicios`, this.options);
  }

  getCupones() {
    return axios.get(`${this.url}/cupones`, this.options);
  }

  createCupon(values)
  {
    return axios.post(`${this.url}/crear`, values, this.options);
  }
}