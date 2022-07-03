import React, { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import Login from "../component/login";
import VideoCall from "../videocall";
import "bootstrap/dist/css/bootstrap.min.css";
import Schedulling from "../component/scheduling";
import PortalParameter from "../component/portal";
import Schedulevideo from "../component/shedulevideo";
import axios from "axios";
function Routers() {
  const [dataPortal, setdataPortal] = useState([]);
  const getDataParameter = async () => {
    if (dataPortal.length === 0) {
      await axios
        .get(`https://api-portal.herokuapp.com/api/v1/supervisor/parameter`)
        .then((result) => setdataPortal(result.data.data[0]))
        .catch((err) => console.log(err));
    }
  };
  useEffect(() => {
    getDataParameter();
  }, [dataPortal]);
  return (
    <div>
      <>
        <Switch>
          <Route exact path="/">
            <Login dataPortal={dataPortal} />
          </Route>
          <Route exact path="/home">
            <VideoCall dataPortal={dataPortal} />
          </Route>
          <Route exact path="/scheduleRequest/:id/:user">
            <Schedulling dataPortal={dataPortal} />
          </Route>
          <Route exact path="/scheduleVideo/:token/:id/:agent/:user">
            <Schedulevideo dataPortal={dataPortal} />
          </Route>
          <Route exact path="/portal">
            <PortalParameter />
          </Route>
          <Route path="*">
            <div>
              <h1>Not Found :(</h1>
            </div>
          </Route>
        </Switch>
      </>
    </div>
  );
}
export default Routers;
