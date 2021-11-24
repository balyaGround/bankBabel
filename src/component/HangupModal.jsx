import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function HangupModal(props) {
    const [show, setShow] = useState(false);

    return (

        <Modal
            {...props}
            size='lg'
            aria-labelledby='contained-modal-title-vcenter'
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id='contained-modal-title-vcenter'>
                    Agent Check Up List
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>You have completed a video call with a customer</h4>
                <p>
                    blablabla
                </p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}