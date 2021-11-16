import React from "react";
import { Button, Modal } from "react-bootstrap";
import Form from "./Formik";
import "./MODAL.CSS";
function ModalForm({ closeModal }) {
  return (
    <div>
      <div className="bungkos">
        <Modal.Header closeButton onClick={() => closeModal(false)}>
          <Modal.Title className="modal-title">Form Data Nasabah</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary">Save</Button>
        </Modal.Footer>
      </div>
    </div>
  );
}

export default ModalForm;
