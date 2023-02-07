export const pedidoInitialState = {
    urlDescarga: `${process.env.REACT_APP_BASE_PATH}/wiqli/pedidos/exportar-excel/todos`,
};

export function pedidoReducer(state = pedidoInitialState, action)
{
    switch(action.type)
    {
        case 'SET_URL_DESCARGA':
            console.log(action)
            let newUrl = '';
            if(action.payload.tipo === 1){
                newUrl = `${process.env.REACT_APP_BASE_PATH}/wiqli/pedidos/exportar-excel/todos`;
            }
            if(action.payload.tipo === 2){
                newUrl = `${process.env.REACT_APP_BASE_PATH}/wiqli/pedidos/exportar-excel/${action.payload.fechaInicial}/${action.payload.fechaFinal}`;
            }
            if(action.payload.tipo === 3){
                let text = "";
                action.payload.keys.forEach((row)=>{
                    text = text+`pedidos[]=${row}&`
                });
                newUrl = `${process.env.REACT_APP_BASE_PATH}/wiqli/pedidos/exportar-excel?${text}`;
            }
            return {
                ...state,
                urlDescarga: newUrl
            };
        default:
            return state;
    }
}