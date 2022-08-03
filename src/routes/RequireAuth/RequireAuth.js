import React from 'react';
import { Redirect } from 'react-router-dom';
import Login from '../../pages/login';

export const RequireAuth = ({Component}) => {
    if (!localStorage.getItem("tknData")) {
        return < Redirect to={Login}/>
    }else{
        return <Component />
    }
}

export const UserAuth = ({Component}) => {
    if (!localStorage.getItem("tknData")) {
        return <Component />
    }else if(localStorage.getItem("type") === '1'){
        return <Redirect from="**" to={`/admin/usuarios`} />
    }else if(localStorage.getItem("type") === '2'){
        return <Redirect from="**" to={`/tienda/devoluciones`} />
    }else if(localStorage.getItem("type") === '3'){
        return <Redirect from="**" to={`/cliente/mis-procesos`} />
    }
}

export const TiendaAuth = ({Component}) => {
    if (!localStorage.getItem("tknData")) {
        return <Component />
    }else{
        return <Redirect from="**" to={`/tienda/devoluciones`} />
    }
}