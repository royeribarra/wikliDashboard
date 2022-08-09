import { MainService } from "../../servicios/mainService";
import axios from "axios";

export class PedidoService extends MainService {
  constructor(url) {
    super(url);
  }

  verPdf(id) {
    return axios.get(`${this.url}/ver-pdf/${id}`, this.options);
  }
}