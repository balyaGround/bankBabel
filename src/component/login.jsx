import React from "react";
import { Form, Button } from "react-bootstrap";
export default function Login() {
  return (
    <>
      <div className="home">
        <div className="create box">
          <div className="tulisan">
            <Form>
              <Form.Group className="mb-3 " controlId="formBasicEmail">
                <Form.Label className="text-white">Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
              </Form.Group>

              <Form.Group className="mb-3 " controlId="formBasicPassword">
                <Form.Label className="text-white">Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
