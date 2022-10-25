import axios from "axios";
import { MainService } from "./mainService";

export class EstadisticaService extends MainService {
  constructor(url) {
    super(url);
  }

  uploadCsv(object) {
    return axios.post(`${this.url}/upload-csv`, object, this.options);
  }

  getPreciosScraping(id)
  {
    return axios.get(`${this.url}/precios/scraping/tiendas/${id}`, this.options);
  }
}