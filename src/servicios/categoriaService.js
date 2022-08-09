import axios from "axios";
import { MainService } from "./mainService";

export class CategoriaService extends MainService {
  constructor(url) {
    super(url);
  }

  getTodos() {
    return axios.get(`${this.url}`, this.options);
  }
}