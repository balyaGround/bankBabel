import React from "react";
import { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import config from "../config";
function Schedulling() {
  firebase.initializeApp(config);
  const db = firebase.firestore();
  const [schedule, setSchedule] = useState({
    date: "",
    email: "",
    nik: "",
    time: "",
  });
  async getMarkers() {
    const events = await firebase.firestore().collection('schedule')
    events.get().then((querySnapshot) => {
        const tempDoc = querySnapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() }
        })
        console.log(tempDoc)
      })
  }
  const getSchedule = () => {
    db.collection("schedule")
      .orderBy("date", "asc")
      .get()
      .then((doc) => {
        doc.forEach((doc) => {
          const jsonData = doc.data();
          const jsonString = JSON.stringify(jsonData);
          console.log("json", jsonString);
          const json = JSON.parse(jsonString);
          setSchedule({ ...schedule, date: json.date, email: json.email, nik: json.nik, time: json.time });
        });
      });
  };

  useEffect(() => {
    getSchedule();
  }, []);
  console.log("schedule", schedule);
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
                  {schedule.map((item) => (
                    <div class="card shadow-sm">
                      <div class="card-body">
                        <p class="card-text">New Request !!</p>
                        <p class="card-text">{item.email}</p>
                        <p class="card-text">{item.nik}</p>
                        <p class="card-text">{item.time}</p>
                        <div class="d-flex justify-content-between align-items-center">
                          <div class="btn-group">
                            <button type="button" class="btn btn-sm btn-outline-secondary">
                              Confirm
                            </button>
                            <button type="button" class="btn btn-sm btn-outline-secondary">
                              Decline
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
