import axios from "axios";
import { MainService } from "./mainService";

export class TiendaService extends MainService {
  constructor(url) {
    super(url);
  }

  getAllSimple() {
    return axios.get(`${this.url}/simple`, this.options);
  }
}