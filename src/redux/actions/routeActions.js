export function updateMigas(url, patientId = '') {
    let migaja = {};
    
    if (url === "/admin/usuarios") {
      migaja = {
        first: "Usuarios",
        second: "",
        firstRoute: "",
      };
    } else if (url.indexOf("/admin/usuarios/crear") !== -1) {
      migaja = {
        first: "Usuario",
        second: "Crear usuario",
        firstRoute: "/admin/usuarios",
      };
    } else if (url.indexOf("/admin/usuarios/") !== -1) {
      migaja = {
        first: "Usuario",
        second: "Editar usuario",
        firstRoute: "/admin/usuarios",
      };
    } else if (url === "/admin/presupuestos") {
      migaja = {
        first: "Presupuestos",
        second: "",
        firstRoute: "",
      };
    } else if (url.indexOf("/admin/presupuestos/paciente") !== -1) {
      migaja = {
        first: "Presupuestos",
        second: "Proforma",
        firstRoute: "/admin/presupuestos",
      };
    } else if (url === "/admin/mantenimientos") {
      migaja = {
        first: "Mantenimientos",
        second: "",
        firstRoute: "",
      };
    } else if (url.indexOf("/admin/mantenimientos/servicios/crear") !== -1) {
      migaja = {
        first: "Mantenimientos",
        second: "Agregar Servicio",
        firstRoute: "/admin/mantenimientos",
      };
    } else if (url.indexOf("/admin/mantenimientos/servicios/") !== -1) {
      migaja = {
        first: "Mantenimientos",
        second: "Editar",
        firstRoute: "/admin/mantenimientos",
      };
    } else if (url.indexOf("/admin/mantenimientos/sedes/crear") !== -1) {
      migaja = {
        first: "Mantenimientos",
        second: "Agregar Sede",
        firstRoute: "/admin/mantenimientos",
      };
    } else if (url.indexOf("/admin/mantenimientos/sedes/") !== -1) {
      migaja = {
        first: "Sedes",
        second: "Editar",
        firstRoute: "/admin/mantenimientos",
      };
    } else if (url === "/admin/cronogramas") {
      migaja = {
        first: "Cronogramas",
        second: "",
        firstRoute: "",
      };
    }
  
  
    else if (url === "/admin/tiendas") {
      migaja = {
        first: "Tiendas",
        second: "",
        firstRoute: "",
      };
    } else if (url.indexOf("/admin/tiendas/crear") !== -1) {
      migaja = {
        first: "Tienda",
        second: "Crear tienda",
        firstRoute: "/admin/tiendas",
      };
    } else if (url.indexOf("/admin/tiendas/") !== -1) {
      migaja = {
        first: "Tienda",
        second: "Editar tienda",
        firstRoute: "/admin/tiendas",
      };
    }
    else if (url === "/tienda/productos") {
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
  
  