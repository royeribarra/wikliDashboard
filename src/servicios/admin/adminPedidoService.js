import axios from "axios";
import { MainService } from "../../servicios/mainService";

export class AdminPedidoService extends MainService {
  constructor(url) {
    super(url);
  }

  pagarTotalPedido(id)
  {
    return axios.get(`${this.url}/pagar-total-pedido/${id}`, this.options);
  }

  cancelarPagoPedido(id)
  {
    return axios.get(`${this.url}/cancelar-pago-pedido/${id}`, this.options);
  }

  registrarPagoPedido(id, params)
  {
    return axios.post(`${this.url}/registrar-pago-pedido/${id}`, params, this.options);
  }

  obtenerPagos(id)
  {
    return axios.get(`${this.url}/obtener-pagos/${id}`, this.options);
  }
}