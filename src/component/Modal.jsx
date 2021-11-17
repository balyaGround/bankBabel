import React from "react";
import { Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "./Formik";

function ModalForm({ closeModal }) {
  return (
    <div>
      <div className="bungkos">
        <Modal.Header>
          <Modal.Title className="modal-title">
            Form Data Nasabah
            <Button variant="primary" style={{ marginLeft: "12rem" }} onClick={() => closeModal(false)}>
              X
            </Button>
          </Modal.Title>
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
