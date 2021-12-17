import React, {useState} from "react";
import { Form, Button } from "react-bootstrap";
import {getDatabase, ref, child, get} from 'firebase/database'
import { Link } from "react-router-dom";

export default function Login() {
  const [userName, setUserName] = useState('')
  const [userPassword, setUserPassword] = useState('')
  const [agentID, setAgentID] = useState('')
  const rtdb = ref(getDatabase())
  const Swal = require('sweetalert2')

  const handleSubmit = async () => {
   await get(child(rtdb, '/User/' + userName)).then((doc) => {
      if(doc.exists()){
        // console.log(doc.val());
        const jsonData = doc.val();
        const jsonString = JSON.stringify(jsonData);
        const json = JSON.parse(jsonString);

        if(userPassword === json.userPassword){
          console.log(json.userPassword);
          window.location.href = '/home?user=' + userName + '&id=' + json.agentID
        }
        else{
          Swal.fire({
            icon: 'error',
            title: 'Username/Password is incorrect'
          })
        }
      }
      else{
        console.log("No data");
      }
    }).catch((e) => {
      console.log(e);
    })
  }

  return (
    <>
      <div className="home">
        <div className="create box">
          <div className="tulisan">
            <Form>
              <Form.Group className="mb-3 " controlId="formBasicEmail">
                <Form.Label className="text-white">User Name</Form.Label>
                <Form.Control type="input" placeholder="Enter email" onChange={(e) => {setUserName(e.target.value)}}/>
              </Form.Group>

              <Form.Group className="mb-3 " controlId="formBasicPassword">
                <Form.Label className="text-white">Password</Form.Label>
                <Form.Control type="password" placeholder="Password" onChange={(e) => {setUserPassword(e.target.value)}} />
              </Form.Group>
              <Button onClick={handleSubmit}>
                Submit
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
