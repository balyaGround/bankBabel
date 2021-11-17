import React from "react";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "./Formik";

function ModalForm({ closeModal }) {
  return (
    <div>
      <div className="bungkos">
        <Modal.Header closeButton={true} onClick={closeModal}>
          <Modal.Title className="modal-title">Form Data Nasabah</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form />
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </div>
    </div>
  );
}

export default ModalForm;
