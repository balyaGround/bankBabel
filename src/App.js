/* eslint-disable jsx-a11y/alt-text */
import { useRef, useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/firestore";
import "firebase/compat/auth";
import "firebase/compat/firestore";
// import {getStorage, getDownloadURL, ref} from 'firebase/storage'
import "./index.css";
import { ReactComponent as HangupIcon } from "./icons/hangup.svg";
import { ReactComponent as MoreIcon } from "./icons/more-vertical.svg";
import { ReactComponent as CopyIcon } from "./icons/copy.svg";
import noimage from "./img/noimage.jpg";
import ScreenRecording from "./screenRecording";

import "bootstrap/dist/css/bootstrap.min.css";

import FormModal from "./component/FormModal.jsx";

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
  const [buttonClicked, setButtonClicked] = useState(false);
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

  // useEffect(() => {
  //   getID();
  // }, []);
  // console.log(joinCode);

  const handleClick = () => {
    if (buttonClicked(false)) {
      while (joinCode === "") {
        firestore
          .collection("rooms")
          .get()
          .then((doc) => {
            doc.forEach((doc) => {
              console.log(doc.id);
              setJoinCode(doc.id.toString());
            });
          });
        console.log(joinCode);
      }
      setPage("join");
    }
  };

  return (
    <div className="home">
      <div className="create box">
        <button onClick={() => setPage("create")}>Create Call</button>
      </div>

      <div className="answer box">
        <input value={joinCode} onChange={(e) => setJoinCode(e.target.value)} placeholder="Join with code" />
        <button onClick={() => setPage("join")}>Answer</button>
      </div>

      <div className="auto connect">
        <input value={joinCode} onChange={(e) => setJoinCode(e.target.value)} />
        <button
          onClick={() => {
            getID();
            setPage("join");
          }}
        >
          Auto Connect
        </button>
      </div>
    </div>
  );
}

function Videos({ mode, callId, setPage }) {
  const pc = new RTCPeerConnection(servers);
  const [webcamActive, setWebcamActive] = useState(false);
  const [roomId, setRoomId] = useState(callId);

  const localRef = useRef();
  const remoteRef = useRef();

  const setupSources = async () => {
    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    const remoteStream = new MediaStream();

    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });

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
      }
    };
  };

  const hangUp = async () => {
    pc.close();

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
  };

  // const photos = () => {
  //   const storage = getStorage()
  //   getDownloadURL(ref(storage, 'ektp.jpg')).then((url) => {
  //     const imgEktp = document.getElementById('ektp')
  //     imgEktp.setAttribute('src', url)
  //   })
  //   .catch((e) => {
  //     console.log(e);
  //   })
  //   getDownloadURL(ref(storage, 'selfieEktp.jpg')).then((url) => {
  //     const imgSelfieEktp = document.getElementById('selfieEktp')
  //     imgSelfieEktp.setAttribute('src', url)
  //   })
  //   .catch((e) => {
  //     console.log(e);
  //   })
  // }

  return (
    <div>
      <ScreenRecording screen={true} audio={true} downloadRecordingPath="Screen_Recording_Demo" downloadRecordingType="mp4" uploadToServer="upload" />

      <div className="videos">
        <video ref={localRef} autoPlay playsInline className="local" muted />
        <video ref={remoteRef} autoPlay playsInline className="remote" />

        <div className="Wrapper-poto" style={{ width: "60rem", height: "20rem", display: "flex", flexDirection: "row", marginLeft: "30rem", marginTop: "30rem" }}>
          <img id="ektp" src={noimage} alt="" style={{ width: "30rem", height: "10rem" }} />
          <img id="selfieEktp" src={noimage} alt="" style={{ width: "30rem", height: "10rem" }} />
        </div>

        <div className="buttonsContainer">
          <button onClick={hangUp} disabled={!webcamActive} className="hangup button">
            <HangupIcon />
          </button>
          <div tabIndex={0} role="button" className="more button">
            <MoreIcon />
            <div className="popoverAwal">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(roomId);
                }}
              >
                <CopyIcon /> Copy joining code
              </button>
              <FormModal />
            </div>
          </div>
        </div>

        {!webcamActive && (
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
        )}
      </div>
    </div>
  );
}

export default App;
