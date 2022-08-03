const spinnerReducer = (state = {
    display: false,
    message: 'Ahi vamos...'
}, action) => {
    switch (action.type) {
        case "TOOGLE":
            state = {
                ...state,
                display: action.payload
            };
            break;
        default:
            return state;
    }
    return state;
};

export default spinnerReducer;