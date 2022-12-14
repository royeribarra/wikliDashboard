import React from "react";
import { Modal } from "antd";
import { ProductoService } from "../../../servicios/productoService";

function DeleteProducto({status, handleClose, handleRefreshTable, activeRow}) {
  const productoService = new ProductoService("wiqli/producto");
  const closeModal = () => {
    handleClose(false);
  };

  const handleSubmit = () => {
    productoService.deleteProduct(activeRow, activeRow.producto_id).then((response) => {
      closeModal();
      handleRefreshTable();
    })
  };

  return (
    <Modal 
      title="Eliminar producto" 
      visible={status} 
      onOk={handleSubmit} 
      onCancel={closeModal}
      okText="Confirmar"
      cancelText="Cancelar"
    >
      <p>¿Está seguro de eliminar este Producto: {activeRow.producto_nombre}?</p>
    </Modal>
  );
}
export default DeleteProducto;