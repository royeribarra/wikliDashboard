

const stateInicial = {
    first: "Cronograma",
    second: "",
    firstRoute: "",
  
  };
  
  const routeReducer = (state = stateInicial, action) => {
    const { type } = action;
    switch (type) {
      case "UPDATE_MIGAS":
        state = {
          ...state,
          first: action.payload.first,
          second: action.payload.second,
          third: action.payload.third,
          firstRoute: action.payload.firstRoute,
          secondRoute: action.payload.secondRoute
        };
        break;
  
      default:
        return state;
    }
    return state;
  };
  
  export default routeReducer;
  