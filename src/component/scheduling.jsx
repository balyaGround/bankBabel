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
import { useStateWithCallbackLazy } from "use-state-with-callback";

function Schedulling() {
  const [data, setData] = useState([]);
  const [parameter, setParameter] = useStateWithCallbackLazy({
    email: "",
    date: "",
    time: "",
    name: "",
    nik: ""
  });
  const { id } = useParams();
  const { user } = useParams();
  const [agentID, setagentID] = useState(id);
  const [userName, setuserName] = useState(user);
  firebase.initializeApp(config);
  // init("user_h6uRyZievx8s1s6rPU7mz");
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
    
    console.log('param use effect:', parameter);
    if(parameter.email !== ''){
      // sendEmail()
      console.log('ada isinya')
    }
  }, []);

  const sendEmail = async () => {
    const param = {
      name: parameter.name,
      email: parameter.email,
      date: parameter.date,
      time: parameter.time,
      nik: parameter.nik
    };
    emailjs.send("service_8wp3jqi", "template_xo34yaw", param, "user_h6uRyZievx8s1s6rPU7mz").then(
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
                        <p class="card-text">{item.name}</p>
                        <p class="card-text">{item.nik}</p>
                        <p class="card-text">{item.time}</p>
                        <div class="d-flex justify-content-between align-items-center">
                          <div class="btn-group">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-success"
                              onClick={(e) => {
                                // setParameter({parameter, email: item.email, date: item.date, time: item.time, name: item.name, nik: item.nik }, () =>{
                                //   console.log(parameter);
                                //   if(parameter.email === ''){
                                //     console.log('kosong');
                                //     setParameter({parameter, email: item.email, date: item.date, time: item.time, name: item.name, nik: item.nik })
                                //     console.log(parameter);
                                //   }
                                //   else{
                                //     sendEmail();
                                //   }
                                // })
                                setParameter({email: item.email, date: item.date, time: item.time, name: item.name, nik: item.nik}, () => {
                                  console.log('isi param', parameter);
                                })
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
