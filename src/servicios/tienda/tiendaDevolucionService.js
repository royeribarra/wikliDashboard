import axios from "axios";
import { MainService } from "../../servicios/mainService";

export class TiendaDevolucionService extends MainService {
  constructor(url) {
    super(url);
  }

  getAllErrors(){
    return axios.get(`${this.url}/por-confirmar/todos`, this.options);
  }

  aceptarDevolucion(gestionId, trackerId)
  {
    return axios.get(`${this.url}/aceptar-devolucion/${gestionId}/${trackerId}`, this.options);
  }

  aceptarDevolucionErrorTienda(id, body){
    return axios.post(`${this.url}-error-tienda/aceptar/${id}`, body, this.options);
  }

  denegarDevolucionErrorTienda(id, body){
    return axios.post(`${this.url}-error-tienda/rechazar/${id}`, body, this.options);
  }

  updateStateFromStore(id, tracker_devolucion) {
    return axios.post(`${this.url}/actualizar-estado/${id}`, tracker_devolucion, this.options);
  }

  denied(id, values){
    return axios.post(`${this.url}/denegar-devolucion/${id}`, values, this.options);
  }

  productoDevuelto(gestionId, trackerId){
    return axios.get(`${this.url}/producto-devuelto/${gestionId}/${trackerId}`, this.options);
  }

  productoNoDevuelto(gestionId, trackerId){
    return axios.get(`${this.url}/producto-no-devuelto/${gestionId}/${trackerId}`, this.options);
  }

  devolverDinero(gestionId, trackerId, valor){
    return axios.post(`${this.url}/devolucion-dinero/${gestionId}/${trackerId}`, valor, this.options);
  }
}