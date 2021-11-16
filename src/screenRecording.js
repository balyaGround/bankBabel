import React, { useState } from "react";
import { Row, Col, Button, Badge } from "antd";
import { useReactMediaRecorder } from "react-media-recorder";
import Text from "antd/lib/typography/Text";
// import 'antd/dist/antd.css'
// import firebase from 'firebase/compat/app'
// import 'firebase/compat/auth'
// import 'firebase/compat/firestore'
// import { getStorage, ref, uploadBytes } from "firebase/storage"

const ScreenRecording = ({ screen, audio, video, downloadRecordingPath, downloadRecordingType, uploadToServer }) => {
  const [recordingNumber, setRecordingNumber] = useState(0);
  const RecordView = () => {
    const { status, startRecording: startRecord, stopRecording: stopRecord, mediaBlobUrl } = useReactMediaRecorder({ screen, audio, video });
    const startRecording = () => {
      return startRecord();
    };
    const stopRecording = () => {
      const currentTimeSatmp = new Date().getTime();
      setRecordingNumber(currentTimeSatmp);
      return stopRecord();
    };
    const viewRecording = () => {
      window.open(mediaBlobUrl, "_blank").focus();
    };
    const downloadRecording = () => {
      const pathName = `${downloadRecordingPath}_${recordingNumber}.${downloadRecordingType}`;
      try {
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          // for IE
          window.navigator.msSaveOrOpenBlob(mediaBlobUrl, pathName);
        } else {
          // for Chrome
          const link = document.createElement("a");
          link.href = mediaBlobUrl;
          link.download = pathName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } catch (err) {
        console.error(err);
      }
    };
    // const uploadRecording = () => {
    //       const storage = getStorage()
    //       const fileName = `${downloadRecordingPath}_${recordingNumber}`;
    //       const storageRef = ref(storage, fileName)
    //       const metadata = {contentType: 'video/mp4'}

    //       try{
    //       const blob = new Promise((resolve, reject) => {
    //         const xhr = new XMLHttpRequest();
    //         xhr.onload = function () {
    //           resolve(xhr.response);
    //         };
    //         xhr.onerror = function (e) {
    //           console.log(e);
    //           reject(new TypeError("Network request failed"));
    //         };
    //         xhr.responseType = "blob";
    //         xhr.open("GET", mediaBlobUrl, true);
    //         xhr.send(null);
    //       });
    //       uploadBytes(storageRef, mediaBlobUrl, metadata).then((snapshot) => {
    //         console.log('Upload Success');
    //       })
    //       }
    //       catch(e){
    //         console.log(e);
    //       }
    //     };
    return (
      <Row>
        <Col span="12" style={{ lineHeight: "24px" }}>
          {status && status !== "stopped" && <Text>Screen Recording Status: {status && status.toUpperCase()}</Text>}
          {status && status === "recording" && (
            <Badge
              className="screen-recording-badge"
              color="#faad14"
              status="processing"
              offset={[2, 0]}
              style={{
                marginLeft: "5px",
              }}
            />
          )}
        </Col>
        <Col span="12" style={{ textAlign: "right" }}>
          {status && status !== "recording" && (
            <Button
              size="small"
              onClick={startRecording}
              type="primary"
              // icon="play-circle"
              className="margin-left-sm"
              ghost
            >
              {mediaBlobUrl ? "Start Recording" : "Start Recording"}
            </Button>
          )}
          {status && status === "recording" && (
            <Button
              size="small"
              onClick={stopRecording}
              type="danger"
              // icon="stop"
              className="margin-left-sm"
              ghost
            >
              Stop Recording
            </Button>
          )}
          {mediaBlobUrl && status && status === "stopped" && (
            <Button size="small" onClick={viewRecording} type="primary" icon="picture" className="viewRecording margin-left-sm">
              View
            </Button>
          )}
          {downloadRecordingType && mediaBlobUrl && status && status === "stopped" && (
            <Button
              size="small"
              onClick={downloadRecording}
              type="primary"
              // icon="download"
              className="downloadRecording margin-left-sm"
            >
              Download
            </Button>
          )}
          {/* {uploadToServer && mediaBlobUrl && status && status === "stopped" && (
            <Button
              size="small"
              onClick={uploadRecording}
              type="primary"
              // icon="mail"
              className="mailRecording margin-left-sm"
            >
              Upload to server
            </Button>
          )} */}
        </Col>
      </Row>
    );
  };
  return (
    <div className="Scren-Record-Wrapper" style={{ padding: "5px 20px" }}>
      {RecordView()}
      {/* <App/> */}
    </div>
  );
};
export default ScreenRecording;
