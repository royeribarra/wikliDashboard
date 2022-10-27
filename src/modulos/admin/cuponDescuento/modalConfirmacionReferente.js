import React from "react";
import { Modal } from "antd";
import { CuponService } from "../../../servicios/admin/cuponService";
import { toastr } from "react-redux-toastr";

function ModalConfirmacionReferente({status, handleClose, handleRefreshTable, activeRow}) {
  const cuponService = new CuponService("wiqli/cupones-descuento");
  const closeModal = () => {
    handleClose(false);
  };

  const handleSubmit = () => {
    cuponService.generarCuponReferente().then(({data}) => {
      toastr.success(data.message);
      closeModal();
    });
  }

  return (
    <Modal 
      title="Confirmar envío de correo masivos." 
      visible={status} 
      onOk={handleSubmit} 
      onCancel={closeModal}
      okText="Confirmar"
      cancelText="Cancelar"
    >
      <p>
        ¿Está seguro de envíar un correo a todos los clientes que ya compraron en Wiqli y enviarles un código para que lo compartan?
      </p>
    </Modal>
  );
}
export default ModalConfirmacionReferente;