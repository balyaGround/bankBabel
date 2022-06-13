import React, { useState } from "react";
import { Row, Col, Button, Badge } from "antd";
import { useReactMediaRecorder } from "react-media-recorder";
import Text from "antd/lib/typography/Text";
import PublitioAPI from "publitio_js_sdk";
import * as fs from "fs";

const ScreenRecording = ({ screen, audio, video, downloadRecordingPath, downloadRecordingType, uploadToServer }) => {
  const [recordingNumber, setRecordingNumber] = useState(0);
  const [credential, setcredential] = useState([]);
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

      alert("ini pathname >>>>", pathName);
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

    const uploadRecording = async () => {
      var axios = require("axios");
      var FormData = require("form-data");
      var fs = require("fs");
      var data = new FormData();

      const fileName = `${downloadRecordingPath}_${recordingNumber}.mp4`;
      const mediaBlob = await fetch(mediaBlobUrl).then((response) => response.blob());

      const video = new File([mediaBlob], fileName, { type: "video/mp4" });

      data.append("policy", "");
      data.append("key", "");
      data.append("x-amz-algorithm", "");
      data.append("x-amz-date", "");
      data.append("x-amz-credential", "");

      var config = {
        method: "put",
        url: "https://dev.vdocipher.com/api/videos?title=upload",
        data: data,
        headers: "Authorization:Apisecret Raeef2tp0AD09KamzBqD2PEpTVZ9KpDYfF5EJqnKGTIcKpkeNfvTCTvxzmWPUB3W",
      };

      axios(config)
        .then((res) => {
          console.log("jolaaaa", JSON.stringify(res.data));
        })
        .catch((e) => console.log(e));

      // var fs = require("fs");
      // const fileName = `${downloadRecordingPath}_${recordingNumber}.${downloadRecordingType}`;
      // const mediaBlob = await fetch(mediaBlobUrl).then((response) => response.blob());

      // const video = new File([mediaBlob], fileName, { type: "video/mp4" });

      // const publitio = new PublitioAPI("QafGSwwsN3vdXcAzSMff", "2qJZ4SSXqyg6pGWhQB3neGWxVQQ48ksd", "option_download", "option_hls", "option_transform");
      // publitio
      //   .uploadFile(video, "file", { option_hls: 1 })
      //   .then((data) => {
      //     console.log(data);
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //   });

      // Encrypt file.c
      console.log("get credential", credential);
    };
    const getCredential = async () => {
      var axios = require("axios");
      var FormData = require("form-data");
      var data = new FormData();

      data.append("policy", "{{policy}}");
      data.append("key", "{{key}}");
      data.append("x-amz-algorithm", "{{x-amz-signature}}");
      data.append("x-amz-date", "{{x-amz-date}}");
      data.append("x-amz-credential", "{{x-amz-credential}}");

      let config = {
        method: "put",
        url: "https://dev.vdocipher.com/api/videos?title=tst",
        headers: {
          Authorization: "Apisecret Raeef2tp0AD09KamzBqD2PEpTVZ9KpDYfF5EJqnKGTIcKpkeNfvTCTvxzmWPUB3W",
          "content-type": "multipart/form-data; boundary=----WebKitFormBoundaryl5qAhT2sJlZ16tWT",
          Accept: "*/*",
          Referer: "http://localhost:3001/",
        },
        data: data,
      };

      axios(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
          console.log(error);
        });

      // var fs = require("fs");
      // const fileName = `${downloadRecordingPath}_${recordingNumber}.${downloadRecordingType}`;
      // const mediaBlob = await fetch(mediaBlobUrl).then((response) => response.blob());

      // const video = new File([mediaBlob], fileName, { type: "video/mp4" });

      // const publitio = new PublitioAPI("QafGSwwsN3vdXcAzSMff", "2qJZ4SSXqyg6pGWhQB3neGWxVQQ48ksd", "option_download", "option_hls", "option_transform");
      // publitio
      //   .uploadFile(video, "file", { option_hls: 1 })
      //   .then((data) => {
      //     console.log(data);
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //   });

      // Encrypt file.c
      console.log("get credential", credential);
      console.log("first", data);
    };

    // // Decrypt file.
    // encryptor.decryptFile("encrypted.dat", "output_file.txt", key, function (err) {
    //   // Decryption complete.
    // });

    // console.log("ini encript decrypt >>", file);

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
              color="rgba(0, 0, 255, 0.192"
              // icon="play-circle"
              className="margin-left-sm"
              ghost
              tea
              onClick={() => {
                getCredential();
                startRecording();
              }}
            >
              {mediaBlobUrl ? "Start Recording" : "Start Recording"}
            </Button>
          )}
          {status && status === "recording" && (
            <Button
              size="small"
              onClick={() => {
                stopRecording();

                // enkripsi();
              }}
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
