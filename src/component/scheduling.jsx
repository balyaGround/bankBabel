import React from "react";
import { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import config from "../config";
import emailjs from "emailjs-com";
import { useParams } from "react-router-dom";
import "../index.css";
import axios from "axios";

function Schedulling() {
  const [data, setData] = useState([]);
  const [disable, setDisable] = React.useState(false);
  const { id } = useParams();
  const { user } = useParams();
  const [agentID, setagentID] = useState(id);
  const [userName, setuserName] = useState(user);
  const [loaded, setLoaded] = useState(false);
  const Swal = require("sweetalert2");

  firebase.initializeApp(config);
  // init("user_h6uRyZievx8s1s6rPU7mz");
  const getSchedule = () => {
    const events = firebase.firestore().collection("schedule").orderBy("date", "asc");
    events.onSnapshot((querySnapshot) => {
      const tempDoc = querySnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      console.log(tempDoc);
      setData(tempDoc);
      setLoaded(true);
    });
  };

  useEffect(() => {
    getSchedule();
  }, []);

  const sendEmail = async (parameter) => {
    const param = {
      name: parameter.name,
      email: parameter.email,
      date: parameter.date,
      time: parameter.time,
      nik: parameter.nik,
    };
    await emailjs.send("service_8wp3jqi", "template_xo34yaw", param, "user_h6uRyZievx8s1s6rPU7mz").then(
      (res) => {
        console.log(res.status, res.text);
      },
      (e) => {
        console.log(e);
      }
    );
  };

  const handleDelete = (parameter) => {
    const param = {
      name: parameter.name,
      email: parameter.email,
      date: parameter.date,
      time: parameter.time,
    };
    const newList = data.filter((item) => item.id !== id);
    setData(newList);
    firebase.firestore().collection("schedule").doc(parameter.id).delete();
    console.log(parameter.id);

    emailjs.send("service_r2ihqx6", "template_cbpp97c", param, "user_BonVmAcN6fy0YqPTciWNC").then(
      (res) => {
        console.log(res.status, res.text);
      },
      (e) => {
        console.log(e);
      }
    );
  };

  const handleNullSchedule = (data) => {
    if (loaded) {
      if (data.length === 0) {
        Swal.fire({
          icon: "info",
          title: "No schedule request received",
          confirmButtonText: "Back",
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/home?user=" + userName + "&id=" + agentID;
          }
        });
      }
    }
  };
  const backHome = () => {
    window.location.href = "/home?user=" + userName + "&id=" + agentID;
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
  return (
    <>
      <div className="schedule " style={{ background: `${dataPortal.background}` }}>
        <div className="backbutton">
          <button style={{ background: `${dataPortal.button}`, boxShadow: " 0px 0px 5px 5px rgba(255 255 255 / 60%)", fontSize: " 20px" }} onClick={backHome}>
            Back to Home
          </button>
        </div>
        <div className="title text-white" style={{ marginBottom: "2rem" }}>
          <h2>Schedule Request</h2>
          {handleNullSchedule(data)}
        </div>
        <div className="create-box" style={{ background: `${dataPortal.box}` }}>
          <div class="album py-5">
            <div class="container album-card">
              <div class="row">
                <div class="col">
                  {data?.map((item) => (
                    <div class="card shadow-sm mb-3" style={{ background: "white" }}>
                      <div class="card-body">
                        <p class="card-text">New Request !!</p>
                        <p class="card-text">Email: {item?.email}</p>
                        <p class="card-text">Name: {item?.name}</p>
                        <p class="card-text">NIK: {item?.nik}</p>
                        <p class="card-text">Time: {item?.time}</p>
                        <p class="card-text">Date: {item?.date}</p>
                        <p class="card-text">Status: {item?.status}</p>
                        <div class="d-flex justify-content-between align-items-center">
                          <div class="btn-group">
                            <button
                              disabled={item?.disable}
                              type="button"
                              className="btn btn-sm btn-outline-success"
                              onClick={() => {
                                console.log("ready", item);

                                firebase.firestore().collection("schedule").doc(item?.id).update({
                                  disable: true,
                                  status: "Confirmed",
                                  disableRoom: false,
                                  disableDecline: true,
                                });

                                sendEmail(item);
                              }}
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => {
                                handleDelete(item);
                              }}
                              disabled={item?.disableDecline}
                            >
                              Decline
                            </button>
                            {/* <Link to={`/scheduleVideo/${item.nik}/${agentID}/${userName}`}> */}
                            <button
                              type="button"
                              className="btn btn-outline-primary"
                              onClick={() => {
                                firebase.firestore().collection("schedule").doc(item?.id).delete();
                                window.location.href = `/scheduleVideo/${item?.nik}/${agentID}/${userName}`;
                              }}
                              disabled={item?.disableRoom}
                            >
                              Make rooms
                            </button>
                            {/* </Link> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Schedulling;
