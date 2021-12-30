import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import { useState, useEffect } from "react";
function PortalParameter() {
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const theme = createTheme({
    palette: {
      primary: {
        light: "#757ce8",
        main: "#fafafa",
        dark: "#002884",
        contrastText: "#fff",
      },
      success: {
        light: "#ff7961",
        main: "#f44336",
        dark: "#ba000d",
        contrastText: "#000",
      },
    },
  });
  const [data, setData] = useState({
    id: "",
    background: "",
    box: "",
    button: "",
    percentage: 0,
  });
  const [dataUpdate, setdataUpdate] = useState({
    id: data?.id,
    background: data?.background,
    box: data?.box,
    button: data?.button,
    percentage: data?.percentage,
  });

  const getDataParameter = async () => {
    await axios
      .get(`https://server-video-call.herokuapp.com/api/parameter`)
      .then((result) => setData(result.data.data[0]))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getDataParameter();
  }, [data]);
  console.log("data >>>>>>>", data);

  useEffect(() => {
    return () => {
      setdataUpdate({ ...dataUpdate, id: data?.id, background: data?.background, box: data?.box, button: data?.button, percentage: data?.percentage });
    };
  }, [data]);

  console.log("updatee >>>>>>>", dataUpdate);
  return (
    <>
      <div className="schedule">
        <div className="title text-white" style={{ marginBottom: "2rem" }}>
          <h2>Parameterize</h2>
        </div>
        <div className="create-box">
          <ThemeProvider theme={theme}>
            <Box sx={{ width: "100%", typography: "body1" }}>
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <TabList onChange={handleChange} aria-label="lab API tabs example" textColor="primary" indicatorColor="primary">
                    <Tab label="Background Color" value="1" />
                    <Tab label="Box Color" value="2" />
                    <Tab label="Button Color" value="3" />
                    <Tab label="Percentage Value" value="4" />
                  </TabList>
                </Box>
                <TabPanel className="text-white" value="1">
                  <label className="me-5" htmlFor="province">
                    Color Value :{" "}
                  </label>
                  <input
                    style={{ border: "1px solid #F0F8FF", boxShadow: "0px 2px 2px white" }}
                    type="text"
                    id="background"
                    name="color"
                    value={dataUpdate?.background}
                    onChange={(e) => setdataUpdate({ ...dataUpdate, background: e.target.value })}
                  />
                </TabPanel>
                <TabPanel className="text-white" value="2">
                  <label className="me-5" htmlFor="Box">
                    Color Value :{" "}
                  </label>
                  <input style={{ border: "1px solid #F0F8FF", boxShadow: "0px 2px 2px white" }} type="text" id="background" name="color" value={dataUpdate?.box} onChange={(e) => setdataUpdate({ ...dataUpdate, box: e.target.value })} />
                </TabPanel>
                <TabPanel className="text-white" value="3">
                  <label className="me-5" htmlFor="Button">
                    Color Value :{" "}
                  </label>
                  <input
                    style={{ border: "1px solid #F0F8FF", boxShadow: "0px 2px 2px white" }}
                    type="text"
                    id="background"
                    name="color"
                    value={dataUpdate?.button}
                    onChange={(e) => setdataUpdate({ ...dataUpdate, button: e.target.value })}
                  />
                </TabPanel>
                <TabPanel className="text-white" value="4">
                  <label className="me-5" htmlFor="Button">
                    Percentage Value :{" "}
                  </label>
                  <input
                    style={{ border: "1px solid #F0F8FF", boxShadow: "0px 2px 2px white" }}
                    type="text"
                    id="background"
                    name="color"
                    value={dataUpdate?.percentage}
                    onChange={(e) => setdataUpdate({ ...dataUpdate, percentage: e.target.value })}
                  />
                </TabPanel>
              </TabContext>
            </Box>
          </ThemeProvider>
        </div>
      </div>
    </>
  );
}

export default PortalParameter;
