import { MainService } from "../../servicios/mainService";
import axios from "axios";

export class PedidoService extends MainService {
  constructor(url) {
    super(url);
  }

  verPdf(id) {
    return axios.get(`${this.url}/ver-pdf/${id}`, this.options);
  }

  getAllIncorrectos(){
    return axios.get(`${this.url}/todos`, this.options);
  }

  getExcel(fechaInicial, fechaFinal){
    return axios.get(`${this.url}/exportar-excel/${fechaInicial}/${fechaFinal}`, this.options);
  }

  getExcelAll(){
    return axios.get(`${this.url}/exportar-excel/todos`, this.options);
  }

  updateDetalle(data, id){
    return axios.post(`${this.url}/${id}`, data, this.options);
  }

  updateState(id)
  {
    return axios.get(`${this.url}/actualizar-estado/${id}`, this.options);
  }

  updateStateDetalle(id)
  {
    return axios.get(`${this.url}/detalle/actualizar-estado/${id}`, this.options);
  }
}