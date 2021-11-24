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