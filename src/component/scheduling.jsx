import React from "react";
import { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import config from "../config";
import emailjs from "emailjs-com";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import "../index.css";

function Schedulling() {
  const [data, setData] = useState([]);
  const [disable, setDisable] = React.useState(false);
  const [status, setStatus] = useState("");
  const disableVar = false;
  const { id } = useParams();
  const { user } = useParams();
  const [agentID, setagentID] = useState(id);
  const [userName, setuserName] = useState(user);

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
    });
  };

  const buttonStatus = () => {
    data?.map((item) => {
      if (item?.status === "Pending") {
        setDisable(false);
      } else {
        setDisable(true);
      }
      // console.log('disable', item?.status)
    });
    console.log("diluar map", disable);
  };

  useEffect(() => {
    getSchedule();
    // setInterval(() => {
    //   buttonStatus()
    // }, 3000)
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
  const setingStatus = (data) => {
    data?.map((item) => {
      if (item?.status == "Pending") {
        setDisable(true);
      } else if (item?.status == "in Call") {
        setDisable(true);
      } else if (item?.status == "Confirmed") {
        setDisable(false);
      }
      console.log("aloooooooooo");
      console.log("first", item.status);
    });
  };

  return (
    <>
      <div className="schedule">
        <div className="title text-white" style={{ marginBottom: "2rem" }}>
          <h2>Schedule Request</h2>
        </div>
        <div className="create-box">
          <div class="album py-5">
            <div class="container album-card">
              <div class="row">
                <div class="col">
                  {data?.map((item) => (
                    <div class="card shadow-sm">
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
                                });

                                // sendEmail(item);
                              }}
                            >
                              Confirm
                            </button>
                            <button type="button" className="btn btn-sm btn-outline-danger">
                              Decline
                            </button>
                            <Link to={`/scheduleVideo/${item.nik}/${agentID}/${userName}`}>
                              <button
                                type="button"
                                className="btn btn-outline-primary"
                                onClick={() => {
                                  firebase.firestore().collection("schedule").doc(item?.id).delete();
                                }}
                              >
                                Make rooms
                              </button>
                            </Link>
                          </div>
                          {/* <small class="text-muted">{item.date}</small> */}
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
