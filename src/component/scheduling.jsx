import React from "react";
import { useEffect, useState, useRef } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import config from "../config";
import emailjs from "emailjs-com";
import { init } from "emailjs-com";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import "../index.css";
function Schedulling() {
  const [data, setData] = useState([]);
  const [parameter, setParameter] = useState({
    name: "",
    email: "",
    date: "",
    time: "",
  });
  const { id } = useParams();
  const { user } = useParams();
  const [agentID, setagentID] = useState(id);
  const [userName, setuserName] = useState(user);
  firebase.initializeApp(config);
  init("user_h6uRyZievx8s1s6rPU7mz");
  const getSchedule = () => {
    const events = firebase.firestore().collection("schedule").orderBy("date", "asc");
    events.get().then((querySnapshot) => {
      const tempDoc = querySnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      console.log(tempDoc);
      setData(tempDoc);
    });
  };
  useEffect(() => {
    getSchedule();
  }, []);

  const sendEmail = async () => {
    const param = {
      name: data.name,
      email: data.email,
      date: data.date,
      time: data.time,
    };

    emailjs.send("service_2nlsg79", "template_edrznh9", param, "user_S1Gy8CUainTQVoLPA5vxr").then(
      (res) => {
        console.log(res.status, res.text);
      },
      (e) => {
        console.log(e);
      }
    );
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
                  {data.map((item) => (
                    <div class="card shadow-sm">
                      <div class="card-body">
                        <p class="card-text">New Request !!</p>
                        <p class="card-text">{item.email}</p>
                        <p class="card-text">{item.nik}</p>
                        <p class="card-text">{item.time}</p>
                        <div class="d-flex justify-content-between align-items-center">
                          <div class="btn-group">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-success"
                              onClick={() => {
                                sendEmail();
                              }}
                            >
                              Confirm
                            </button>
                            <button type="button" className="btn btn-sm btn-outline-danger">
                              Decline
                            </button>
                            <Link to={`/scheduleVideo/${item.nik}/${agentID}/${userName}`}>
                              <button type="button" className="btn btn-outline-primary">
                                Make rooms
                              </button>
                            </Link>
                          </div>
                          <small class="text-muted">{item.date}</small>
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
