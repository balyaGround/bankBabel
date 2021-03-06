import React from "react";
import { Container, Col, Row } from "react-bootstrap";
import { ReactComponent as HangupIcon } from "../icons/hangup.svg";
import { ReactComponent as MoreIcon } from "../icons/more-vertical.svg";
import { useState, useRef, useEffect } from "react";
import ScreenRecording from "../screenRecording";
import noimage from "../img/noimage.jpg";
import { getStorage, getDownloadURL, ref } from "firebase/storage";
import firebase from "firebase/compat/app";
import { useParams } from "react-router-dom";
import FormModal from "./FormModal";
import axios from "axios";
function Schedulevideo(dataPortal) {
  const servers = {
    iceServers: [
      {
        urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
      },
    ],
    iceCandidatePoolSize: 1,
  };
  const pc = new RTCPeerConnection(servers);
  const Swal = require("sweetalert2");
  const [roomId, setRoomId] = useState();
  const [webcamActive, setWebcamActive] = useState(false);
  const localRef = useRef();
  const remoteRef = useRef();
  const storage = getStorage();
  const { id } = useParams();
  const { agent } = useParams();
  const { user } = useParams();
  const { token } = useParams();
  const agentID = agent;
  const userName = user;
  const Token = token;
  console.log("tokenHP", Token);
  const firestore = firebase.firestore();
  const [dataInputPost, setDataInputPost] = useState([]);

  const pushNotif = async () => {
    let data = JSON.stringify({
      data: {
        score: "5x1",
        time: "15:10",
      },
      to: `${token}`,
      direct_boot_ok: true,
    });

    let config = {
      method: "post",
      url: "https://fcm.googleapis.com/fcm/send",
      headers: {
        Authorization: "key=AAAAIVSy4tk:APA91bGvAXcE3WrbsLf1kcnNDrtbDMMHIzz09B2XKqN4VfFkLati-h6SgP0BtSbpB_FnNK9NIR9WkrYyP8AFB8tpuBBMWyWBzeevGT9G0MaTC0jHlJ1-wL6wS8cEdFAJv56dIJmQaCD_",
        "Content-Type": "application/json",
      },
      data: data,
    };
    setTimeout(() => {
      axios(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
          console.log(error);
        });
    }, 1500);
  };
  const getInputPost = () => {
    var axios = require("axios");
    var config = {
      method: "get",
      url: "https://api-portal.herokuapp.com/api/v1/video",
    };

    axios(config)
      .then(function (response) {
        setDataInputPost(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const uploadRecordFlowplayer = () => {
    getInputPost();
    const found = dataInputPost?.findLast((element) => element);
    const input = found?.file;
    console.log("last", input);
    var axios = require("axios");
    var data = JSON.stringify({
      name: "tes upload rabu",
      unpublish: false,
      published: true,
      remote: false,
      input: `${input}`,
      user_id: "3a0fea13-4e34-4c51-ae2d-17dc333264ab",
      workspace: {
        id: "e64c186b-c0b9-4331-862a-ee5d9f026bc6",
        name: "IST ProductProject",
      },
    });

    var config = {
      method: "post",
      url: "https://api.flowplayer.com/platform/v3/videos",
      headers: {
        "x-flowplayer-api-key": "90ee5c9c-0032-4c1b-a9d3-81cba010a53b",
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  useEffect(() => {
    pushNotif();
  }, []);

  console.log("data input post", dataInputPost);
  const setupSources = async () => {
    let localStream;

    localStream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: 720,
        height: 576,
      },
      audio: true,
    });

    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });

    const remoteStream = new MediaStream();

    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
    };

    localRef.current.srcObject = localStream;
    remoteRef.current.srcObject = remoteStream;

    setWebcamActive(true);
    // const callDoc = firestore.collection("rooms").doc();
    // const offerCandidates = callDoc.collection("callerCandidates");
    // const answerCandidates = callDoc.collection("calleeCandidates");

    const scheduledRoom = firestore.collection("rooms").doc("scheduledRoom").collection("scheduledRoomID").doc(id);
    const offerCandidates = scheduledRoom.collection("callerCandidates");
    const answerCandidates = scheduledRoom.collection("calleeCandidates");

    setRoomId(id);

    pc.onicecandidate = (event) => {
      event.candidate && offerCandidates.add(event.candidate.toJSON());
    };

    const offerDescription = await pc.createOffer();
    await pc.setLocalDescription(offerDescription);

    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };

    const time = Date.now();

    // await callDoc.set({ offer, time, agentID });
    await scheduledRoom.set({ offer, time });

    scheduledRoom.onSnapshot((snapshot) => {
      const data = snapshot.data();
      if (!pc.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        pc.setRemoteDescription(answerDescription);
      }
    });

    answerCandidates.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const candidate = new RTCIceCandidate(change.doc.data());
          pc.addIceCandidate(candidate);
        }
      });
    });
    const hangUpFail = async () => {
      pc.close();
      Swal.fire({
        icon: "error",
        title: "Video Call Connection Failed",
        text: "Your connection to the customer has failed, please try again.",
        confirmButtonText: "Complete",
      }).then(async (result) => {
        if (result.isConfirmed) {
          if (roomId) {
            let roomRef = firestore.collection("rooms").doc("scheduledRoom").collection("scheduledRoomID").doc(id);
            await roomRef
              .collection("calleeCandidates")
              .get()
              .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                  doc.ref.delete();
                });
              });
            await roomRef
              .collection("callerCandidates")
              .get()
              .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                  doc.ref.delete();
                });
              });

            await roomRef.delete();
          }

          const isActive = firestore.collection("isActive").doc("agentActive");

          isActive.set({
            Agent1: true,
          });
          window.location.href = "/home?user=" + userName + "&id=" + agentID;
        }
      });
    };

    const increment = firebase.firestore.FieldValue.increment(1);
    pc.onconnectionstatechange = async () => {
      console.log(pc.connectionState);
      if (pc.connectionState === "disconnected") {
        hangUp();
        await firestore.collection("rooms").doc("scheduledRoom").collection("scheduledRoomID").doc(id).delete();
      } else if (pc.connectionState === "failed") {
        hangUpFail();
        pc.restartIce();
        await firestore.collection("rooms").doc("scheduledRoom").collection("scheduledRoomID").doc(id).delete();
      } else if (pc.connectionState === "connected") {
        let timerInterval;
        Swal.fire({
          icon: "info",
          title: pc.connectionState,
          text: "You are currently connecting to a customer, please wait",
          timerProgressBar: true,
          timer: 1500,
          didOpen: () => {
            Swal.showLoading();
            timerInterval = setInterval(() => {
              Swal.getTimerLeft();
            }, 1500);
          },
          willClose: () => {
            clearInterval(timerInterval);
          },
        });
        firestore
          .collection("isActive")
          .doc("agent" + agentID)
          .update({
            loggedIn: true,
            inCall: true,
            VCHandled: increment,
          });
      }
    };
  };

  const hangUp = async () => {
    const increment = firebase.firestore.FieldValue.increment(1);
    pc.close();
    uploadRecordFlowplayer();
    Swal.fire({
      icon: "info",
      title: "Video Call Complete",
      text: "Make sure you have done the mandatory procedures and gave your best services",
      confirmButtonText: "Complete",
      cancelButtonText: "Back to call",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        // await sendEmail();

        if (id) {
          let roomRef = firestore.collection("rooms").doc("scheduledRoom").collection("scheduledRoomID").doc(id);
          await roomRef
            .collection("calleeCandidates")
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                doc.ref.delete();
              });
            });
          await roomRef
            .collection("callerCandidates")
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                doc.ref.delete();
              });
            });
          await roomRef.delete();
          await firestore
            .collection("isActive")
            .doc("agent" + agentID)
            .update({
              inCall: false,
              VCHandled: increment,
            });
        }

        window.location.href = "/home?user=" + userName + "&id=" + agentID;
      }
    });
  };

  const popupSelfieKtp = () => {
    const Swal = require("sweetalert2");

    getDownloadURL(ref(storage, "selfieEktp.jpg")).then((url) => {
      const imgSelfieEktp = document.getElementById("selfieEktp");
      let timerInterval;
      if (imgSelfieEktp.src === url) {
        Swal.fire({
          imageUrl: url,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "No Image Available",
          text: "Please retrieve image first!",
          timerProgressBar: true,
          timer: 1500,
          didOpen: () => {
            Swal.showLoading();
            timerInterval = setInterval(() => {
              Swal.getTimerLeft();
            }, 100);
          },
          willClose: () => {
            clearInterval(timerInterval);
          },
        });
      }
    });
  };

  const popupImgKtp = () => {
    const Swal = require("sweetalert2");

    getDownloadURL(ref(storage, "ektp.jpg")).then((url) => {
      const imgEktp = document.getElementById("ektp");
      let timerInterval;
      if (imgEktp.src === url) {
        Swal.fire({
          imageUrl: url,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "No Image Available",
          text: "Please retrieve image first!",
          timerProgressBar: true,
          timer: 1500,
          didOpen: () => {
            Swal.showLoading();
            timerInterval = setInterval(() => {
              Swal.getTimerLeft();
            }, 100);
          },
          willClose: () => {
            clearInterval(timerInterval);
          },
        });
      }
    });
  };
  useEffect(() => {
    setupSources();
  }, []);

  console.log("nikpasiingan", id);
  console.log("agentid", agentID);

  return (
    <div>
      <Container fluid style={{ background: `${dataPortal?.dataPortal?.background}`, height: "100vh" }}>
        <Row className="justify-content-center text-white">
          <Col>
            <ScreenRecording screen={true} audio={true} downloadRecordingPath="Screen_Recording_Demo" downloadRecordingType="mp4" uploadToServer="upload" style={{ backgroundColor: "blue" }} />
          </Col>
        </Row>
        <div className="videos ">
          {/* <div className="container " style={{ marginBottom: "5rem" }}> */}
          {/* <div className="row "> */}
          <Container className="mb-3">
            <Row className="justify-content-center text-white">
              <Col xs lg={4}>
                <video ref={localRef} autoPlay playsInline className="local" muted />
                <h5 style={{ textAlign: "center", marginTop: "1rem" }}>Agent Video</h5>
              </Col>
              <Col xs lg={2}></Col>
              <Col xs lg={4}>
                <video ref={remoteRef} autoPlay playsInline className="remote" />
                <h5 style={{ textAlign: "center", marginTop: "1rem" }}>Client Video</h5>
              </Col>
            </Row>
          </Container>

          <Container>
            <Row className="justify-content-center text-white">
              <Col xs lg={4} className="poto-ktp">
                <img id="ektp" onClick={popupImgKtp} src={noimage} alt="" style={{ width: "30rem", height: "20rem" }} />
                <h5 style={{ textAlign: "center", marginTop: "1rem" }}>e-KTP</h5>
              </Col>

              <Col xs lg={2}></Col>

              <Col xs lg={4} className="frame-ktp">
                <img id="selfieEktp" onClick={popupSelfieKtp} src={noimage} alt="" style={{ width: "30rem", height: "20rem" }} />
                <h5 style={{ textAlign: "center", marginTop: "1rem" }}>Selfie + e-KTP</h5>
              </Col>
            </Row>
          </Container>

          <div className="container buttonsContainer ">
            <div className="row">
              <div className="col">
                <button
                  onClick={() => {
                    hangUp();
                  }}
                  disabled={!webcamActive}
                  className="hangup button"
                >
                  <HangupIcon />
                  {/* <HangupModal open={openModal} /> */}
                </button>
              </div>
              <div className="col more button" tabIndex={0} role="button">
                <MoreIcon />
                <div className="popoverAwal">
                  <button>
                    <div>
                      <FormModal dataportal={dataPortal} />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* {!webcamActive && (
      <div className="modalContainerBawaan">
        <div className="modalBawaan">
          <h3>Turn on your camera and microphone and start the call</h3>
          <div className="container">
            <button onClick={() => setPage("home")} className="secondary">
              Cancel
            </button>
            <button onClick={setupSources}>Start</button>
          </div>
        </div>
      </div>
    )} */}
      </Container>
    </div>
  );
}

export default Schedulevideo;
