import axios from "axios";
import { MainService } from "../mainService";

export class RepoOperadorLogisticoService extends MainService {
  constructor(url) {
    super(url);
  }

  getCarriers(id){
    return axios.get(`${this.url}/${id}`, this.options);
  }
}