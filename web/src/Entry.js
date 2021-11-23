import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Login from "./Login";
import Profile from "./Profile";

const Entry = () => {
  return (
    <Router>
      <Switch>
        <Route path="/profile">
          <Profile />
        </Route>
        <Route path="/">
          <Login />
        </Route>
      </Switch>
    </Router>
  );
};

export default Entry;
