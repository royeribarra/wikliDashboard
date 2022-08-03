import React from "react";
import { Modal, Button } from "antd";
import { ProductoService } from "../../../servicios/productoService";

function DeleteCupon({status, handleClose, handleRefreshTable, activeRow}) {
    const productoService = new ProductoService("products");
    const closeModal = () => {
        handleClose(false);
    };

    const handleSubmit = () => {
        productoService.deleteProduct(activeRow, activeRow.id).then((response) => {
            closeModal();
            handleRefreshTable();
        })
    };

    return (
        <Modal show={status} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Eliminar Producto</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                ¿Está seguro de eliminar este Producto?
                <br />
                <br />
                <div className="d-flex justify-content-between">
                    <Button variant="secondary" onClick={closeModal}>
                        Cancelar
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => {
                            handleSubmit();
                        }}
                        type="button"
                    >
                        Eliminar
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );
}
export default DeleteCupon;