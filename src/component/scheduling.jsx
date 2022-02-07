import React from "react";
import { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import config from "../config";
import emailjs from "emailjs-com";
import { init } from "emailjs-com";
function Schedulling() {
  firebase.initializeApp(config);
  init("user_h6uRyZievx8s1s6rPU7mz");
  const [data, setData] = useState([]);
  const sendEmail = async () => {
    const param = {
      name: data[0].name,
      email: data[0].email,
      date: data[0].date,
      time: data[0].time,
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
  console.log("data", data);
  return (
    <>
      <div className="schedule">
        <div className="title text-white" style={{ marginBottom: "2rem" }}>
          <h2>Schedule Request</h2>
        </div>
        <div className="create-box">
          <div class="album py-5">
            <div class="container album-card">
              <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
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
                            <button type="button" class="btn btn-sm btn-outline-secondary" onClick={sendEmail}>
                              Confirm
                            </button>
                            <button type="button" class="btn btn-sm btn-outline-secondary">
                              Decline
                            </button>
                            <button type="button" class="btn btn-sm btn-outline-secondary">
                              Make room
                            </button>
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
