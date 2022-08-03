import axios from "axios";
import { MainService } from "./mainService";

export class VentaService extends MainService {
  constructor(url) {
    super(url);
  }

  getAllSimple() {
    return axios.get(`${this.url}/simple`, this.options);
  }

  uploadCsv(object) {
    return axios.post(`${this.url}/upload-csv`, object, this.options);
  }
}