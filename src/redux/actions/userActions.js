import { UserService } from "../../servicios/userService";

export function getProfiles() {
    return dispatch => {
        const userService = new UserService("users");
        userService.getProfiles()
            .then(({data}) => {
                dispatch({
                    type: "GET_PROFILES",
                    payload: data
                 });
            }, (err) => {

            })
    };
}

export function getSedes() {
    return dispatch => {

        const userService = new UserService("users");
        userService.getSedes()
            .then(({data}) => {
                dispatch({
                    type: "GET_SEDES",
                    payload: data
                 });
            }, (err) => {

            })
    };
}