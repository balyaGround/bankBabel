import React, { useState } from "react";
import { Row, Col, Button, Badge } from "antd";
import { useReactMediaRecorder } from "react-media-recorder";
import Text from "antd/lib/typography/Text";
import axios from "axios";

const ScreenRecording = ({ screen, audio, video, downloadRecordingPath, downloadRecordingType, uploadToServer }) => {
  const [recordingNumber, setRecordingNumber] = useState(0);

  const RecordView = () => {
    const { status, startRecording: startRecord, stopRecording: stopRecord, mediaBlobUrl } = useReactMediaRecorder({ screen, audio, video });

    const startRecording = () => {
      return startRecord();
    };
    const stopRecording = () => {
      const currentTimeStamp = new Date().getTime();
      setRecordingNumber(currentTimeStamp);
      // uploadRecording()
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
    }

    const uploadRecording = async () => {
      const url = 'https://api-portal.herokuapp.com/api/v1/video'
      const fileName = `${downloadRecordingPath}_${recordingNumber}.${downloadRecordingType}`;
      const mediaBlob = await fetch(mediaBlobUrl)
        .then(response => response.blob());

      const myFile = new File(
          [mediaBlob],
          fileName,
          {type: 'video/mp4'}
      );

      console.log(mediaBlob)
      console.log(myFile)


      
      axios.post(url, {file: myFile}).then((res)=>{
        console.log(res.data)
      }).catch((e)=>console.log(e))
    }
    return (
      <Row>
        <Col span="6" style={{ lineHeight: "24px", marginBottom: "-2rem" }} className="text-white">
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
        <Col span="6" style={{ textAlign: "right" }}>
          {status && status !== "recording" && (
            <Button
              size="small"
              onClick={startRecording}
              color="rgba(0, 0, 255, 0.192"
              // icon="play-circle"
              className="margin-left-sm"
              ghost
              tea
            >
              {mediaBlobUrl ? "Start Recording" : "Start Recording"}
            </Button>
          )}
          {status && status === "recording" && (
            <Button
              size="small"
              onClick={() => {stopRecording(); uploadRecording()}}
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
