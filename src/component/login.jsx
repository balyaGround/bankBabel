import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { getDatabase, ref, child, get } from "firebase/database";
import axios from "axios";
export default function Login() {
  const [userName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const rtdb = ref(getDatabase());
  const Swal = require("sweetalert2");

  const handleSubmit = async () => {
    await get(child(rtdb, "/User/" + userName))
      .then((doc) => {
        if (doc.exists()) {
          // console.log(doc.val());
          const jsonData = doc.val();
          const jsonString = JSON.stringify(jsonData);
          const json = JSON.parse(jsonString);

          if (userPassword === json.userPassword) {
            console.log(json.userPassword);
            window.location.href = "/home?user=" + userName + "&id=" + json.agentID;
          } else {
            Swal.fire({
              icon: "error",
              title: "Username/Password is incorrect",
            });
          }
        } else {
          console.log("no data");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const [dataPortal, setdataPortal] = useState([]);
  const getDataParameter = async () => {
    await axios
      .get(`https://api-portal.herokuapp.com/api/v1/supervisor/parameter`)
      .then((result) => setdataPortal(result.data.data[0]))
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getDataParameter();
  }, []);

  console.log("dataPortal", dataPortal);
  return (
    <>
      <div className="home" style={{ background: `${dataPortal.background}` }}>
        <div className="create box" style={{ background: `${dataPortal.box}` }}>
          <div className="tulisan">
            <Form className="d-flex flex-column align-items-center">
              <Form.Group className="mb-3 " controlId="formBasicEmail">
                <Form.Label className="text-white">User Name</Form.Label>
                <Form.Control
                  type="input"
                  placeholder="Enter email"
                  onChange={(e) => {
                    setUserName(e.target.value);
                  }}
                />
              </Form.Group>

              <Form.Group className="mb-3 " controlId="formBasicPassword">
                <Form.Label className="text-white">Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  onChange={(e) => {
                    setUserPassword(e.target.value);
                  }}
                />
              </Form.Group>
              <button style={{ background: `${dataPortal.button}`, boxShadow: " 0px 0px 5px 5px rgba(255 255 255 / 60%)", fontSize: " 20px" }} onClick={handleSubmit}>
                Submit
              </button>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
