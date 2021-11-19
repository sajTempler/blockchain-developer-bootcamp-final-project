import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import Switch from "@mui/material/Switch";

import { useTokenizeAccount } from "./context";
import { useProvider, useTokenizeAccountContract } from "./hooks";

const TokenizeAccount = () => {
  // example user id from any platform
  const userId = "12345";
  const { selectedAccount, contract } = useTokenizeAccountContract();
  const { state, dispatch } = useTokenizeAccount();
  const { provider } = useProvider();

  const [checked, setChecked] = useState(false);
  const handleSwitchChange = () => {
    contract
      .tokenize(
        selectedAccount,
        userId,
        `${window.location.origin}/api/user/${userId}`
      )
      .then((res) => {
        console.log("tokenize", res);
        provider
          .waitForTransaction(res.hash)
          .then((res) => {
            console.log("waitForTransaction res", res);
            setChecked((prev) => !prev);
          })
          .catch(console.error);
      })
      .catch(console.error);
  };

  const [token, setToken] = useState("");

  useEffect(() => {
    if (contract && selectedAccount) {
      contract
        .retrieveMyAccountTokens(selectedAccount)
        .then((res) => {
          console.log("retrieveMyAccountTokens", res.toString());
          setToken(res.toString());
          if (res.toString() !== "0") {
            setChecked(true);
          }
        })
        .catch(console.error);
    }
  }, [contract, selectedAccount]);

  return (
    <>
      <Typography style={{ marginTop: "2rem" }} variant="h5" component="div">
        Tokenize account
      </Typography>
      <Switch
        disabled={checked}
        onChange={handleSwitchChange}
        checked={checked}
      />
      {checked && (
        <Typography variant="body2" component="p">
          Token {token && token}
        </Typography>
      )}
    </>
  );
};

export default TokenizeAccount;
