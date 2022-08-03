export class LocalStorage {
    typeStorage = 'local';
  
    getItem(key) {
      return localStorage.getItem(key);
    }
  
    getItemObject(key) {
      return JSON.parse(localStorage.getItem(key));
    }
  
    removeItem(key) {
      localStorage.removeItem(key);
    }
  
    setItem(key, data) {
      const type = typeof data;
      const value = type === 'object' ? JSON.stringify(data) : data.toString();
      localStorage.setItem(key, value);
    }
  
    clear() {
      localStorage.clear();
    }
  }
  
  export class SessionStorage {
    typeStorage = 'session';
  
    getItem(key) {
      return sessionStorage.getItem(key);
    }
  
    getItemObject(key) {
      return JSON.parse(sessionStorage.getItem(key));
    }
  
    removeItem(key) {
      sessionStorage.removeItem(key);
    }
  
    setItem(key, data) {
      const type = typeof data;
      const value = type === 'object' ? JSON.stringify(data) : data.toString();
      sessionStorage.setItem(key, value);
    }
  
    clear() {
      sessionStorage.clear();
    }
  }
  
  
  export default class StorageService {
  
    constructor(type) {
      this.typeStorage = type;
      this.storage = '';
      this.setStorage();
    }
  
    setConfig(options) {
      if (options.typeStorage) {
        this.typeStorage = options.typeStorage;
        this.setStorage();
      }
    }
  
    setStorage() {
      switch (this.typeStorage) {
        case 'session':
          this.storage = new SessionStorage();
          break;
        case 'local':
          this.storage = new LocalStorage();
          break;
        // case 'cookie':
        //   this.storage = new CookieStorage();
        //   break;
        default:
          this.storage = new LocalStorage();
          break;
      }
    }
  
    get() {
      return this.storage;
    }
  
    getItem(key) {
      return this.storage.getItem(key);
    }
  
    getItemObject(key) {
      const itemStorage = this.getItem(key);
      return itemStorage ? JSON.parse(atob(itemStorage)) : null;
    }
   
    removeItem(key) {
      this.storage.removeItem(key);
    }
  
    setItem(key, obj) {
      this.storage.setItem(key, obj);
    }
  
    setItemObject(key, obj) {
      const dataTmp = btoa(JSON.stringify(obj));
      this.setItem(key, dataTmp);
    }
  
    clear() {
      this.storage.clear();
    }
  
  }