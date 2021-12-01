import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "./Formik";

import Draggable from "react-draggable";
import { getStorage, getDownloadURL, ref } from "firebase/storage";
import FormIcon from "../icons/form-icon.jpg";
import { CgImage } from "react-icons/cg";

function FormModal() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const photos = () => {
    const storage = getStorage();
    getDownloadURL(ref(storage, "ektp.jpg"))
      .then((url) => {
        const imgEktp = document.getElementById("ektp");
        imgEktp.setAttribute("src", url);
      })
      .catch((e) => {
        console.log(e);
      });
    getDownloadURL(ref(storage, "selfieEktp.jpg"))
      .then((url) => {
        const imgSelfieEktp = document.getElementById("selfieEktp");
        imgSelfieEktp.setAttribute("src", url);
      })
      .catch((e) => {
        console.log(e);
      });
    console.log("loading");
  };

  return (
    <>
      <button onClick={handleShow}>
        <img src={FormIcon} alt="form" style={{ width: "45px", height: "45px" }} />
        Form Validation
      </button>
      <button onClick={photos}>
        <CgImage style={{ width: "45px", height: "45px" }} />
        Retrieve Image
      </button>
      <Draggable>
        <Modal show={show} className="bungkus">
          <Modal.Body>
            <Modal.Title className="mb-3">
              Form Data Nasabah
              <Button onClick={handleClose} variant="outline-info" style={{ marginLeft: "12rem" }}>
                X
              </Button>
            </Modal.Title>

            <Form />
          </Modal.Body>
        </Modal>
      </Draggable>
    </>
  );
}

export default FormModal;

//tes push  again
//push
