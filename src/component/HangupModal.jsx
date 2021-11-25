<<<<<<< HEAD
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
=======
import React from "react";
import { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";

function HangupModal({open}) {
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const handleOpen = () => {
        if (open) {
            setShow(true)
        }
    }

    useEffect(() => {
        handleOpen()
    })

    return (
        <div>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop='static'
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Video Call Complete
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    blablablabalbla
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={handleClose}>Complete</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default HangupModal
>>>>>>> e9161e6f2755eed1a07dc54d6b0a4777eaa021a3
