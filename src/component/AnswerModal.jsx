import React from "react";
import { useState, useEffect } from "react";
import loading from "../img/loadingbaBel.gif";
import { Modal, Button } from "react-bootstrap";

function AnswerModal({ joinId, setHalaman, firebase, setJoinCode }) {
  const [show, setshow] = useState(false);
  const handleOpen = () => {
    if (joinId !== "") {
      setshow(true);
    }
  };
  const handleClose = () => {
    setshow(false);
  };
  const getId = () => {
    firebase
      .collection("rooms")
      .get()
      .then((doc) => {
        doc.forEach((doc) => {
          console.log(doc.id);
          setJoinCode(doc.id.toString());
        });
      });
  };

  useEffect(() => {
    handleOpen();
    setInterval(() => {
      getId()
    }, 15000);
  }, [joinId]);

  return (
    <div>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Answer Call</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={loading} alt='' style={{ width: "30rem", height: "20rem" }} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Reject
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              getId();
              setHalaman("join");
            }}
          >
            Accept
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default AnswerModal;
