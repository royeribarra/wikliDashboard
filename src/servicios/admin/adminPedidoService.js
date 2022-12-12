import axios from "axios";
import { MainService } from "../../servicios/mainService";

export class AdminPedidoService extends MainService {
  constructor(url) {
    super(url);
  }

  pagarPedido(id)
  {
    return axios.get(`${this.url}/pagar-pedido/${id}`, this.options);
  }
}