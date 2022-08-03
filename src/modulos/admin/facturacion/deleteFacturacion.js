import React from "react";
import { Modal } from "antd";
import { toastr } from "react-redux-toastr";
import { RepoFacturacionService } from "../../../servicios/admin/repoFacturacionService";
import { Button } from "reactstrap";

function DeleteFacturacion({status, handleClose, handleRefreshTable, activeRow}) 
{
  const facturacionService = new RepoFacturacionService("repo/facturacion");
  const closeModal = () => {
    handleClose(false);
  };

  const handleSubmit = () => {
    if(activeRow.es_facturado){
      facturacionService.eliminarFacturacion(activeRow, activeRow.id).then(({data}) => {
        toastr.success(data.message)
        closeModal();
        handleRefreshTable();
      })
    }else{
      facturacionService.agregarFacturacion(activeRow, activeRow.id).then(({data}) => {
        toastr.info(data.message)
        closeModal();
        handleRefreshTable();
      })
    }
  };

  return (
    
    <Modal 
      title={activeRow.es_facturado ? 'Eliminar Facturación' : 'Agregar Facturación'} 
      visible={status}
      onCancel={closeModal}
      footer={
        [
          
          (activeRow.es_facturado) ? 
          <Button color="danger" onClick={handleSubmit}>Eliminar</Button> : <Button onClick={handleSubmit} color="info">Agregar</Button>
          
        ]
      }
    >
      {
        activeRow.es_facturado ? (
          `¿Está seguro de quitar el proceso con código ${activeRow.codigo_repo} de la facturación?`
        ):
        (
          `¿Está seguro de agregar el proceso con código ${activeRow.codigo_repo} a la facturación?`
        )
      }
    </Modal>
  );
}
export default DeleteFacturacion;