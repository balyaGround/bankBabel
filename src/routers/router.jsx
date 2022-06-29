import React, { useState, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import Login from "../component/login";
import VideoCall from "../videocall";
import "bootstrap/dist/css/bootstrap.min.css";
import Schedulling from "../component/scheduling";
import PortalParameter from "../component/portal";
import Schedulevideo from "../component/shedulevideo";
function Routers() {
  return (
    <div>
      <>
        <Switch>
          <Route exact path="/">
            <Login />
          </Route>
          <Route exact path="/home">
            <VideoCall />
          </Route>
          <Route exact path="/scheduleRequest/:id/:user">
            <Schedulling />
          </Route>
          <Route exact path="/scheduleVideo/:token/:id/:agent/:user">
            <Schedulevideo />
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
