import { MainService } from "../../servicios/mainService";
import axios from "axios";

export class PedidoService extends MainService {
  constructor(url) {
    super(url);
  }

  verPdf(id) {
    return axios.get(`${this.url}/ver-pdf/${id}`, this.options);
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
}