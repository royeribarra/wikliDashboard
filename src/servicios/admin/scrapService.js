import axios from "axios";
import { MainService } from "../../servicios/mainService";

export class ScrapService extends MainService {
  constructor(url) {
    super(url);
  }

  generarCuponReferente()
  {
    return axios.get(`${this.url}/envio-correos/codigo/referente`, this.options);
  }

  updateState(id)
  {
    return axios.get(`${this.url}/actualizar-estado/${id}`, this.options);
  }
}