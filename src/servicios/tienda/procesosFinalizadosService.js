import axios from "axios";
import { MainService } from "../../servicios/mainService";

export class ProcesosFinalizadosService extends MainService {
  constructor(url) {
    super(url);
  }

  getProcesos(){
    return axios.get(`${this.url}`, this.options);
  }
}