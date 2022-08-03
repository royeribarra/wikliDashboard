import axios from "axios";
import { MainService } from "./mainService";

export class UserService extends MainService {
  constructor(url) {
    super(url);
  }

  getProfiles() {
    return axios.get(`${this.url}/profiles`, this.options);
  }

  getSedes() {
    return axios.get(`${this.url}/sedes`, this.options);
  }

  updateState(id)
  {
    return axios.get(`${this.url}/update-state/${id}`, this.options);
  }
}
  