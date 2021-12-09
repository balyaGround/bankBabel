/* eslint-disable jsx-a11y/alt-text */
import { useRef, useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/firestore";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "./index.css";
import { ReactComponent as HangupIcon } from "./icons/hangup.svg";
import { ReactComponent as MoreIcon } from "./icons/more-vertical.svg";
import { getStorage, getDownloadURL, ref } from "firebase/storage";
import noimage from "./img/noimage.jpg";
import ScreenRecording from "./screenRecording";
import "bootstrap/dist/css/bootstrap.min.css";


import FormModal from "./component/FormModal.jsx";
import AnswerModal from "./component/AnswerModal";


import emailjs from 'emailjs-com'
import {init} from 'emailjs-com'

import { Container, Col, Row } from "react-bootstrap";

// Initialize Firebase
const firebaseConfig = {
  // YOUR FIREBASE CONFIG HERE
  apiKey: "AIzaSyBK4_ckiJfuDrGH2naN07SmruemW2EjRPM",
  authDomain: "webrtc-dd6e4.firebaseapp.com",
  databaseURL: "https://webrtc-dd6e4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "webrtc-dd6e4",
  storageBucket: "webrtc-dd6e4.appspot.com",
  messagingSenderId: "143154930393",
  appId: "1:143154930393:web:1465b41294f95cb5f8d4c8",
  measurementId: "G-XV6LN18P27",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const firestore = firebase.firestore();

// Initialize WebRTC
const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 2,
};

// const pc = new RTCPeerConnection(servers);

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [joinCode, setJoinCode] = useState("");

  return <div className="app">{currentPage === "home" ? <Menu joinCode={joinCode} setJoinCode={setJoinCode} setPage={setCurrentPage} /> : <Videos mode={currentPage} callId={joinCode} setPage={setCurrentPage} />}</div>;
}

function Menu({ joinCode, setJoinCode, setPage }) {
  const getID = () => {
    firestore
      .collection("rooms")
      .get()
      .then((doc) => {
        doc.forEach((doc) => {
          console.log(doc.id);
          setJoinCode(doc.id.toString());
        });
      });
  };

  useEffect(() => {
    setInterval(() => {
      getID();
    }, 15000);
  }, []);

  return (
    <div className="home">
      <div className="create box">
        <div className="tulisan">
          <h4>You can wait for an incoming call pop up</h4>
          <br/>
          <h4>OR</h4>
        </div>
        <button onClick={() => setPage("create")}>Create Call</button>
      </div>

      <AnswerModal joinId={joinCode} setHalaman={setPage} firebase={firestore} setJoinCode={setJoinCode} />
      {/* <div className="auto connect">
        <input value={joinCode} onChange={(e) => setJoinCode(e.target.value)} />
        <button
          onClick={() => {
            getID();
            setPage("join");
          }}
        >
          Auto Connect
        </button>
      </div> */}
    </div>
  );
}

function Videos({ mode, callId, setPage }) {
  const pc = new RTCPeerConnection(servers);
  const [webcamActive, setWebcamActive] = useState(false);
  const [roomId, setRoomId] = useState(callId);
  const Swal = require("sweetalert2");
  const localRef = useRef();
  const remoteRef = useRef();
  const storage = getStorage();
  init('user_h6uRyZievx8s1s6rPU7mz')
  const setupSources = async () => {
    let localStream

    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    })

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

    if (mode === "create") {
      // const roomId = Date.now().toString()
      const callDoc = firestore.collection("rooms").doc();
      const offerCandidates = callDoc.collection("callerCandidates");
      const answerCandidates = callDoc.collection("calleeCandidates");
      const isActive = firestore.collection("isActive").doc("agentActive");

      isActive.set({
        Agent1: false,
      });

      // firebaseid.forEach(doc => {
      //   console.log(doc.id)
      // })

      setRoomId(callDoc.id);

      pc.onicecandidate = (event) => {
        event.candidate && offerCandidates.add(event.candidate.toJSON());
      };

      const offerDescription = await pc.createOffer();
      await pc.setLocalDescription(offerDescription);

      const offer = {
        sdp: offerDescription.sdp,
        type: offerDescription.type,
      };

      const time = {
        time: Date.now(),
      };

      await callDoc.set({ offer, time });

      callDoc.onSnapshot((snapshot) => {
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
    } else if (mode === "join") {
      const callDoc = firestore.collection("rooms").doc(callId);
      const answerCandidates = callDoc.collection("calleeCandidates");
      const offerCandidates = callDoc.collection("callerCandidates");
      const isActive = firestore.collection("isActive").doc("agentActive");

      isActive.set({
        Agent1: false,
      });

      pc.onicecandidate = (event) => {
        event.candidate && answerCandidates.add(event.candidate.toJSON());
      };

      const callData = (await callDoc.get()).data();

      const offerDescription = callData.offer;
      await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

      const answerDescription = await pc.createAnswer();
      await pc.setLocalDescription(answerDescription);

      const answer = {
        type: answerDescription.type,
        sdp: answerDescription.sdp,
      };

      await callDoc.update({ answer });

      offerCandidates.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            let data = change.doc.data();
            pc.addIceCandidate(new RTCIceCandidate(data));
          }
        });
      });
    }

    pc.onconnectionstatechange = () => {
      console.log(pc.connectionState);
      if (pc.connectionState === "disconnected") {
        hangUp();
        firestore.collection("rooms").doc(roomId).delete();
      } else if (pc.connectionState === "failed") {
        hangUpFail();
        pc.restartIce()
        firestore.collection("rooms").doc(roomId).delete();
      }
      else if (pc.connectionState === 'connecting'){
        let timerInterval
        Swal.fire({
          icon: 'info',
          title: pc.connectionState,
          text: 'You are currently connecting to a customer, please wait',
          timerProgressBar: true,
          timer: 3500,
          didOpen: () => {
            Swal.showLoading()
            timerInterval = setInterval(() => {
              Swal.getTimerLeft()
            }, 100)
          },
          willClose: () => {
            clearInterval(timerInterval)
          }
        })
      }
    };
  };

  useEffect(() => {
    setupSources()
  }, [])


  const hangUp = async () => {
    pc.close();
    Swal.fire({
      icon: "info",
      title: "Video Call Complete",
      text: "Make sure you have done the mandatory procedures and gave your best services",
      confirmButtonText: "Complete",
      cancelButtonText: "Back to call",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (roomId) {
          let roomRef = firestore.collection("rooms").doc(roomId);
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


        await firestore.collection('form').doc('user').get().then((doc) => {
          const jsonData = doc.data();
          const jsonString = JSON.stringify(jsonData);
          const json = JSON.parse(jsonString);
          
          const param = {
            name: json.name,
            email: json.email
          }
          
          emailjs.send("service_8wp3jqi","template_xo34yaw", param)
          .then((res) => {
            console.log(res.status, res.text);
          }, (e) => {
            console.log(e);
          })
          window.location.reload();
        })
      }
    });
  };

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
          let roomRef = firestore.collection("rooms").doc(roomId);
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
        window.location.reload();
      }
    });
  };

  const popupImgKtp = () => {
    const Swal = require('sweetalert2')    

    getDownloadURL(ref(storage, "ektp.jpg"))
    .then((url) => {
      const imgEktp = document.getElementById("ektp");
      let timerInterval
      if(imgEktp.src === url){
        Swal.fire({
          imageUrl: url,
        })
      }
      else{
        Swal.fire({
          icon: 'error',
          title: 'No Image Available',
          text: 'Please retrieve image first!',
          timerProgressBar: true,
          timer: 1500,
          didOpen: () => {
            Swal.showLoading()
            timerInterval = setInterval(() => {
              Swal.getTimerLeft()
            }, 100)
          },
          willClose: () => {
            clearInterval(timerInterval)
          }
        })
      }
    })
  }

  const popupSelfieKtp = () => {
    const Swal = require('sweetalert2')

    getDownloadURL(ref(storage, "selfieEktp.jpg"))
    .then((url) => {
      const imgSelfieEktp = document.getElementById("selfieEktp");
      let timerInterval
      if(imgSelfieEktp.src === url){
        Swal.fire({
          imageUrl: url,
      })}
      else{
        Swal.fire({
          icon: 'error',
          title: 'No Image Available',
          text: 'Please retrieve image first!',
          timerProgressBar: true,
          timer: 1500,
          didOpen: () => {
            Swal.showLoading()
            timerInterval = setInterval(() => {
              Swal.getTimerLeft()
            }, 100)
          },
          willClose: () => {
            clearInterval(timerInterval)
          }
        })
      }
    })
  }

  return (
    <div>
    <Container fluid>
      <div className="videos">
      <ScreenRecording screen={true} audio={true} downloadRecordingPath="Screen_Recording_Demo" downloadRecordingType="mp4" uploadToServer="upload" />
        {/* <div className="container " style={{ marginBottom: "5rem" }}> */}
        {/* <div className="row "> */}
        <Container>
          <Row className="justify-content-center">
            <Col xs lg = {4}>
              <video ref={localRef} autoPlay playsInline className="local" muted />
              <h5 style={{  textAlign: 'center' }}>Agent Video</h5>
            </Col>
            <Col xs lg = {2}></Col>
            <Col xs lg = {4}>
              <video ref={remoteRef} autoPlay playsInline className="remote" />
              <h5 style={{ textAlign: 'center' }}>Client Video</h5>
            </Col>
          </Row>
        </Container>
        {/* </div> */}
        {/* </div> */}

        <Container>
          <Row className="justify-content-center ">
            <Col xs lg={4} className="poto-ktp">
              <img id="ektp" onClick = {popupImgKtp} src={noimage} alt="" style={{ width: "30rem", height: "20rem" }} />
              <h5 style={{ textAlign: 'center' }}>e-KTP</h5>
            </Col>

            <Col xs lg = {2} ></Col>

            <Col xs lg={4} className="frame-ktp">
              <img id="selfieEktp" onClick = {popupSelfieKtp} src={noimage} alt="" style={{ width: "30rem", height: "20rem" }} />
              <h5 style={{ textAlign: 'center' }}>Selfie + e-KTP</h5>
            </Col>
          </Row>
        </Container>

        {/* <div className="container d-block poto  " style={{ marginTop: "13rem" }}>
          <div className="row ">
            <div className="col d-flex justify-content-center ">
              <div style={{ backgroundColor: " rgba(0, 0, 255, 0.192)", padding: "1rem" }}>
                <img id="ektp" src={noimage} alt="" style={{ width: "30rem", height: "20rem" }} />
              </div>
            </div>
            <div className="col d-flex justify-content-center">
              <div style={{ backgroundColor: " rgba(0, 0, 255, 0.192)", padding: "1rem" }}>
                <img id="selfieEktp" src={noimage} alt="" style={{ width: "30rem", height: "20rem" }} />
              </div>
            </div>
          </div>
        </div> */}

        <div className="container buttonsContainer " style={{ marginTop: "2rem" }}>
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
                    <FormModal />
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

export default App;
