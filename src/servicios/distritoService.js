import axios from "axios";
import { MainService } from "./mainService";

export class DistritoService extends MainService {
  constructor(url) {
    super(url);
  }

  getAll() {
    return axios.get(`${this.url}`, this.options);
  }
}