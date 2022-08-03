import axios from "axios";
import LogService from "./logService";
import StorageService from "./storageService";

export class MainService {
    headers = {};

    constructor(url){
        
        this.url = this.sanitizeUrl(url);
        this.options = this.getAuthInfo();
    }

    getAuthInfo() {
        const storageService = new StorageService();
        const {access_token} = storageService.getItemObject('tknData');
        this.accessToken = access_token;
        const options = this.addOptions(access_token);
        return options;
    }

    addOptions(accessToken, params) {


      return {
         headers: {
            'Accept': 'application/json',
           'Authorization': `Bearer ${accessToken}`
         },
         params
       }
     }

     addHeaders(newHeaders) {
         const {params, headers} = this.options;

         return {
            headers: {...headers, ...newHeaders},
            params
         }
     }


    sanitizeUrl(url){
        const urlSanitized = `${process.env.REACT_APP_BASE_PATH}/api/${url}`;
        return urlSanitized;
    }

    async getAll(params = {page: 1 }) {
        const options = {...this.options, params};
        try {
            const res = await axios.get(this.url, options);
            return await res;

        } catch (error) {
            const logService = new LogService();
            logService.logout(this.accessToken);
            return;
        }
        
    }

    async get(id, secondId = '') {
        const url = secondId ? `${this.url}/${id}/${secondId}` : `${this.url}/${id}`;
        try {
            const res = await axios.get(url, this.options);
            return await res;

        } catch (error) {
            const logService = new LogService();
            logService.logout(this.accessToken);
            return;
        }
    }

    store(object, id, headers = {}) {
        this.options = this.addHeaders(headers)
        const response = (id) 
            ? this.updateAsync(id, object)
            : this.saveAsync(object);

        return response;
    }

    async saveAsync(object) {
        try {
            const res = await axios.post(this.url, object, this.options);
            return await res;

        } catch (error) {
            const logService = new LogService();
            logService.logout(this.accessToken);
        }
        // return axios.post(this.url, object, this.options);
    }
    
    async updateAsync(id, object) {
        try {
            const res = await axios.post(`${this.url}/${id}`, object, this.options);
            return await res;
            
        } catch (error) {
            const logService = new LogService();
            logService.logout(this.accessToken);
        }

        // return axios.post(`${this.url}/${id}`, object, this.options);
    }

    async delete(id) {
        try {
            const res = await axios.delete(`${this.url}/${id}`, this.options);
            return await res;
            
        } catch (error) {
            const logService = new LogService();
            logService.logout(this.accessToken);
        }

        // return axios.delete(`${this.url}/${id}`, this.options);
    }

    async changeStatus(object) {
        try {
            const res = await axios.post(`${this.url}/state`, object, this.options);
            return await res;
            
        } catch (error) {
            const logService = new LogService();
            logService.logout(this.accessToken);
        }

        // return axios.post(`${this.url}/state`, object, this.options);
    }

} 

