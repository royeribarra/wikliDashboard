import { MainService } from "../../servicios/mainService";
import axios from "axios";

export class DetallePedidoService extends MainService {
  constructor(url) {
    super(url);
  }

  updateDetalle(data, id){
    return axios.post(`${this.url}/${id}`, data, this.options);
  }

  updateStateDetalle(id)
  {
    return axios.get(`${this.url}/detalle/actualizar-estado/${id}`, this.options);
  }

  agregarProductoDetalle(pedidoId, productoId, data)
  {
    return axios.post(`${this.url}/detalle/agregar-producto/${pedidoId}/${productoId}`, data, this.options);
  }

  eliminarDetallePedido(detalleId)
  {
    return axios.get(`${this.url}/eliminar/${detalleId}`, this.options);
  }
}