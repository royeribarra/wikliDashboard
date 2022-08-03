import axios from "axios";
import {
  LOG_ENDPOINTS
} from "../config/constants";
import StorageService from "./storageService";

export default class LogService {

  oauth(values) {
    const oauthObj = {
      ...values,
      client_id: process.env.REACT_APP_OAUTH_CLIENT_ID,
      client_secret: process.env.REACT_APP_OAUTH_CLIENT_SECRET,
      grant_type: process.env.REACT_APP_OAUTH_GRANT_TYPE
    }
    return axios.post(LOG_ENDPOINTS.oauth, oauthObj);
  }

  oauthTienda(values) {
    const oauthObj = {
      ...values,
      client_id: process.env.REACT_APP_OAUTH_CLIENT_ID,
      client_secret: process.env.REACT_APP_OAUTH_CLIENT_SECRET,
      grant_type: process.env.REACT_APP_OAUTH_GRANT_TYPE
    }
    return axios.post(LOG_ENDPOINTS.oauthTienda, oauthObj);
  }

  oauthCliente(values) {
    const oauthObj = {
      ...values,
      client_id: process.env.REACT_APP_OAUTH_CLIENT_ID,
      client_secret: process.env.REACT_APP_OAUTH_CLIENT_SECRET,
      grant_type: process.env.REACT_APP_OAUTH_GRANT_TYPE
    }
    return axios.post(LOG_ENDPOINTS.oauthCliente, oauthObj);
  }

  getAuthInfo(accessToken) {
    const options = this.addOptions(accessToken);
    return axios.get(LOG_ENDPOINTS.authinfo, options);
  }

  addOptions(accessToken) {
     return {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  }


  logout(accessToken) {
    const options = this.addOptions(accessToken);
    const storageService = new StorageService;
    storageService.clear();
    axios.get(LOG_ENDPOINTS.deleteToken, options).then(null);
    window.location.href = '/';
    return;
  }

}