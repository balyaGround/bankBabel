import React from "react";
import { useState, useEffect } from "react";
import loading from "../img/loadingbaBel.gif";
import { Modal, Button } from "react-bootstrap";

function AnswerModal({ joinId, setHalaman, firebase, setJoinCode, agentID }) {
  const [show, setshow] = useState(false);

  const handleOpen = () => {
    if (joinId !== "") {
      setshow(true);
    }
  };
  const handleClose = () => {
    setshow(false);
  };

  const agent = () => {
    firebase
    .collection('isActive')
    .doc('agent1')
    .get()
    .then((doc) => {
      const jsonData = doc.data()
      console.log(jsonData);
    })
  }

  const getId = () => {
    firebase
      .collection("rooms")
      .doc('roomAgent' + agentID)
      .collection('roomIDAgent' + agentID)
      .orderBy('time', 'asc')
      .limit(1)
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
      getId();
    }, 10000);
  }, [joinId]);

  return (
    <div>
      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Answer Call</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={loading} alt="" style={{ width: "30rem", height: "20rem" }} />
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
