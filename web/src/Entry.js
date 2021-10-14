import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ethers } from "ethers";

import Login from "./Login";
import Profile from "./Profile";
import { useApp } from "./state/app.context";
import { ACTIONS } from "./state/actions";

const Entry = () => {
  const { dispatch } = useApp();

  useEffect(() => {
    if (window?.ethereum) {
      if (window.ethereum.isConnected()) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        dispatch({
          type: ACTIONS.SET_PROVIDER,
          payload: provider,
        });
      } else {
        const init = async () => {
          await window.ethereum.enable();
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          dispatch({
            type: ACTIONS.SET_PROVIDER,
            payload: provider,
          });
        };
        init();
      }
    }
  }, []);

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
