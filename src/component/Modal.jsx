import React from "react";
import { Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "./Formik";
import "./modal.css";
function ModalForm({ showModal }) {
  return (
    <div>
      <div className="bungkos">
        <Modal.Header closeButton onClick={() => showModal(false)}>
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
