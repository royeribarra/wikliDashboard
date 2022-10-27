import axios from "axios";
import { MainService } from "../../servicios/mainService";

export class CuponService extends MainService {
  constructor(url) {
    super(url);
  }

  generarCuponReferente()
  {
    return axios.get(`${this.url}/envio-correos/codigo/referente`, this.options);
  }
}