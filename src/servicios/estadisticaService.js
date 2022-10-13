import axios from "axios";
import { MainService } from "./mainService";

export class EstadisticaService extends MainService {
  constructor(url) {
    super(url);
  }

  uploadCsv(object) {
    return axios.post(`${this.url}/upload-csv`, object, this.options);
  }
}