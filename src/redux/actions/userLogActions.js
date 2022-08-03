import { toastr } from "react-redux-toastr";
import LogService from "../../servicios/logService";
import StorageService from "../../servicios/storageService";

export function login(values) {

    return dispatch => {
        const logService = new LogService();
        const storageServicce = new StorageService(); 
       
        logService.oauth(values)
            .then(({data}) => {
                if(data.status === false){
                    toastr.error(data.message)
                    window.location.reload(false);
                }
                if(data.status){
                    storageServicce.setItemObject('tknData', data);
                    logService.getAuthInfo(data.access_token).then(({data}) => {
                        storageServicce.setItemObject('authUser', data)
                        storageServicce.setItem('type', 1)
                        dispatch({
                            type: "LOGIN",
                            payload: data
                         });
    
                         dispatch({
                            type: "HIDE",
                            payload: false
                        });
    
                        window.location.href = '/admin/usuarios';
                    },
                    (err)=> {
                        dispatch({
                            type: "HIDE",
                            payload: false
                        });
                    })
                }
                
            }, (err) => {
                dispatch({
                    type: "HIDE",
                    payload: false
                });
            });
    }
}

export function setAge(age) {
    return {
        type: "SET_AGE",
        payload: age
    };
}