import React from "react";
import { useEffect, useState, useRef } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import config from "../config";
import emailjs from "emailjs-com";
import { init } from "emailjs-com";
import Schedulevideo from "./shedulevideo";
import { Link } from "react-router-dom";
function Schedulling() {
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
      setRoomId(tempDoc[3].nik);
    });
  };
  useEffect(() => {
    getSchedule();
  }, []);
  const [roomId, setRoomId] = useState("");
  const [data, setData] = useState([]);
  const [webcamActive, setWebcamActive] = useState(false);
  const firestore = firebase.firestore();
  const servers = {
    iceServers: [
      {
        urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
      },
    ],
    iceCandidatePoolSize: 2,
  };

  const pc = new RTCPeerConnection(servers);
  const localRef = useRef();
  const remoteRef = useRef();

  // const setupSources = async () => {
  //   let localStream;

  //   localStream = await navigator.mediaDevices.getUserMedia({
  //     video: true,
  //     audio: true,
  //   });

  //   localStream.getTracks().forEach((track) => {
  //     pc.addTrack(track, localStream);
  //   });

  //   const remoteStream = new MediaStream();

  //   pc.ontrack = (event) => {
  //     event.streams[0].getTracks().forEach((track) => {
  //       remoteStream.addTrack(track);
  //     });
  //   };

  //   localRef.current.srcObject = localStream;
  //   remoteRef.current.srcObject = remoteStream;

  //   setWebcamActive(true);
  //   // const callDoc = firestore.collection("rooms").doc();
  //   // const offerCandidates = callDoc.collection("callerCandidates");
  //   // const answerCandidates = callDoc.collection("calleeCandidates");

  //   const scheduledRoom = firestore.collection("rooms").doc("scheduledRoom").collection("scheduledRoomID").doc();
  //   const offerCandidates = scheduledRoom.collection("callerCandidates");
  //   const answerCandidates = scheduledRoom.collection("calleeCandidates");

  //   setRoomId(roomId);

  //   pc.onicecandidate = (event) => {
  //     event.candidate && offerCandidates.add(event.candidate.toJSON());
  //   };

  //   const offerDescription = await pc.createOffer();
  //   await pc.setLocalDescription(offerDescription);

  //   const offer = {
  //     sdp: offerDescription.sdp,
  //     type: offerDescription.type,
  //   };

  //   const time = Date.now();

  //   // await callDoc.set({ offer, time, agentID });
  //   await scheduledRoom.set({ offer, time });

  //   scheduledRoom.onSnapshot((snapshot) => {
  //     const data = snapshot.data();
  //     if (!pc.currentRemoteDescription && data?.answer) {
  //       const answerDescription = new RTCSessionDescription(data.answer);
  //       pc.setRemoteDescription(answerDescription);
  //     }
  //   });

  //   answerCandidates.onSnapshot((snapshot) => {
  //     snapshot.docChanges().forEach((change) => {
  //       if (change.type === "added") {
  //         const candidate = new RTCIceCandidate(change.doc.data());
  //         pc.addIceCandidate(candidate);
  //       }
  //     });
  //   });

  //   // const increment = firebase.firestore.FieldValue.increment(1);
  //   // pc.onconnectionstatechange = async () => {
  //   //   console.log(pc.connectionState);
  //   //   if (pc.connectionState === "disconnected") {
  //   //     hangUp();
  //   //     await firestore
  //   //       .collection("rooms")
  //   //       .doc("roomAgent" + agentID)
  //   //       .collection("roomIDAgent" + agentID)
  //   //       .doc(callId)
  //   //       .delete();
  //   //   } else if (pc.connectionState === "failed") {
  //   //     hangUpFail();
  //   //     pc.restartIce();
  //   //     await firestore
  //   //       .collection("rooms")
  //   //       .doc("roomAgent" + agentID)
  //   //       .collection("roomIDAgent" + agentID)
  //   //       .doc(callId)
  //   //       .delete();
  //   //   } else if (pc.connectionState === "connected") {
  //   //     let timerInterval;
  //   //     Swal.fire({
  //   //       icon: "info",
  //   //       title: pc.connectionState,
  //   //       text: "You are currently connecting to a customer, please wait",
  //   //       timerProgressBar: true,
  //   //       timer: 1500,
  //   //       didOpen: () => {
  //   //         Swal.showLoading();
  //   //         timerInterval = setInterval(() => {
  //   //           Swal.getTimerLeft();
  //   //         }, 1500);
  //   //       },
  //   //       willClose: () => {
  //   //         clearInterval(timerInterval);
  //   //       },
  //   //     });
  //   //     firestore
  //   //       .collection("isActive")
  //   //       .doc("agent" + agentID)
  //   //       .update({
  //   //         loggedIn: true,
  //   //         inCall: true,
  //   //         VCHandled: increment,
  //   //       });
  //   //   }
  //   // };
  // };

  // useEffect(() => {
  //   setupSources();
  // }, []);

  const sendEmail = async () => {
    const param = {
      name: data[2].name,
      email: data[2].email,
      date: data[2].date,
      time: data[2].time,
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

  console.log("data", roomId);
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
                            <Link to href="/scheduleVideo">
                              <button
                                type="button"
                                class="btn btn-sm btn-outline-secondary"
                                onClick={() => {
                                  // setupSources();
                                  <Schedulevideo callid={roomId} />;
                                  console.log("aloooooo");
                                }}
                              >
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
