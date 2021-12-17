import React, { useState } from "react";
import { Switch, Route } from "react-router-dom";
import Login from "../component/login";
import VideoCall from "../videocall";
import "bootstrap/dist/css/bootstrap.min.css";
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