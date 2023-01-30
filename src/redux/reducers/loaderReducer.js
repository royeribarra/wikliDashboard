export const loaderInitialState = {
    show: false,
};

export function loaderReducer(state = loaderInitialState, action)
{
    switch(action.type)
    {
        case 'SHOW':
            return {
                ...state,
                show: true,
            };
        case 'CLOSE':
            return {
                ...state,
                show: false,
            };
        default:
            return state;
    }
}