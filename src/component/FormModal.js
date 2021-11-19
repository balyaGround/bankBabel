import React, {useState} from "react";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "./Formik";
import FormIcon from '../icons/form-icon.jpg'

function FormModal() {
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    return (
      <>
        <button onClick={handleShow}>
        <img src={FormIcon} alt="form" style={{ width: "45px", height: "45px" }} />
         Form Validation
        </button>
  
        <div className = 'bungkos'>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title className = 'modal-title'> Form Data Nasabah</Modal.Title>
          </Modal.Header>
          <Modal.Body>
              <Form/>
          </Modal.Body>
        </Modal>
        </div>
      </>
    );
  }

  export default FormModal
  