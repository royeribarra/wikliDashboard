export const STORAGE_URL = `${process.env.REACT_APP_BASE_PATH}/storage/`;

export const EXCEL_URL = {
  // monthlyReport: `${process.env.REACT_APP_BASE_PATH}/storage/public/reports/`
  monthlyReport: `${process.env.REACT_APP_BASE_PATH}/cronograma/montly-report`
}

export const PDF_URL = { 
  proforma: `${process.env.REACT_APP_BASE_PATH}/presupuestos/`
}

export const PDF_URL_ORDERS = { 
  order: `${process.env.REACT_APP_BASE_PATH}/patient-orders/`
}

export const LOG_ENDPOINTS = {
  oauth: `${process.env.REACT_APP_BASE_PATH}/oauth/token`,
  oauthTienda: `${process.env.REACT_APP_BASE_PATH}/oauth-tienda/token`,
  oauthCliente: `${process.env.REACT_APP_BASE_PATH}/oauth-cliente/token`,
  authinfo: `${process.env.REACT_APP_BASE_PATH}/api/authinfo`,
  deleteToken: `${process.env.REACT_APP_BASE_PATH}/api/users/logout`
} 