import { MainService } from "./mainService";
import axios from "axios";
class MaintananceSedeService extends MainService {
  constructor(url) {
    super(url); // call the super class constructor and pass in the name parameter
  }

  getAllSimple() {
    return axios.get(`${this.url}/simple`, this.options);
  }
  
}

export default MaintananceSedeService;
  