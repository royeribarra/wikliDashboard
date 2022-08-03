const stateInicial = {
    profiles: [],
    sedes: []
  };
  
  const userReducer = (state = stateInicial, action) => {
    const { type } = action;
  
    switch (type) {
      case "GET_PROFILES":
        state = {
          ...state,
          profiles: action.payload,
        };
        break;
  
      case "GET_SEDES":
          state = {
              ...state,
              sedes: action.payload,
          };
          break;
        
      default:
        return state;
    }
    return state;
  };
  
  export default userReducer;
  