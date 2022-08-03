export function updateMigas(url, patientId = '') {
    let migaja = {};

    if (url === "/tienda/productos") {
      migaja = {
        first: "Productos",
        second: "",
        firstRoute: "",
      };
    } else if (url.indexOf("/tienda/productos/crear") !== -1) {
      migaja = {
        first: "Producto",
        second: "Crear producto",
        firstRoute: "/tienda/productos",
      };
    } else if (url.indexOf("/tienda/productos/") !== -1) {
      migaja = {
        first: "Producto",
        second: "Editar producto",
        firstRoute: "/tienda/productos",
      };
    }
  
    return {
      type: "UPDATE_MIGAS",
      payload: migaja,
    };
}