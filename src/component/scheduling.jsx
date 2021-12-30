import React from "react";
import { useEffect, useState } from "react";
function Schedulling({ firebase }) {
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

  // const [timeReq, setTimeReq] = useState("");
  // const getTime = () => {
  //   firebase
  //     .collection("schedule")
  //     .doc()
  //     .orderBy("timeReq", "asc")
  //     .get()
  //     .then((doc) => {
  //       doc.forEach((doc) => {
  //         console.log(doc.id);
  //         setTimeReq(doc.id.toString());
  //       });
  //     });
  // };

  // useEffect(() => {
  //   getTime();
  // }, []);
  // console.log("time", timeReq);
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
                  <div class="card shadow-sm">
                    <div class="card-body">
                      <p class="card-text">New Request !!</p>
                      <div class="d-flex justify-content-between align-items-center">
                        <div class="btn-group">
                          <button type="button" class="btn btn-sm btn-outline-secondary">
                            View
                          </button>
                          <button type="button" class="btn btn-sm btn-outline-secondary">
                            Edit
                          </button>
                        </div>
                        <small class="text-muted">9 mins</small>
                      </div>
                    </div>
                  </div>
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
