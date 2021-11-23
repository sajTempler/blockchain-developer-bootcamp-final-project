import React, { useEffect } from "react";
import { Button, Typography } from "@mui/material";
import Switch from "@mui/material/Switch";

import { useTokenizeAccount } from "./context";
import {
  useAccountTokenizedListener,
  useInitAccountToken,
  useProvider,
  useTokenizeAccountContract,
} from "./hooks";
import { TOKENIZE_ACCOUNT } from "./actions";

const TokenizeAccount = () => {
  // example user id from any platform
  const userId = "12345";
  const { selectedAccount, contract } = useTokenizeAccountContract();
  const { state, dispatch } = useTokenizeAccount();
  const { provider } = useProvider();
  useAccountTokenizedListener(contract, selectedAccount, dispatch);
  useInitAccountToken(contract, selectedAccount, dispatch);

  const handleSwitchChange = () => {
    dispatch({
      type: TOKENIZE_ACCOUNT.SET_PENDING,
    });
    contract
      .tokenize(
        selectedAccount,
        userId,
        `${window.location.origin}/api/user/${userId}`
      )
      .then((res) => {
        console.log("contract tokenize", res);
        provider
          .waitForTransaction(res.hash)
          .then((res) => {
            console.log("contract tokenize waitForTransaction res", res);
            dispatch({
              type: TOKENIZE_ACCOUNT.SET_COMPLETED,
            });
          })
          .catch(console.error);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const more = () => {
    console.log("more");
  };

  return (
    <>
      <Typography sx={{ my: 2 }} variant="h5" component="div">
        Tokenize account
      </Typography>
      <Switch
        disabled={state.accountTokenized || state.state === "TOKENIZE_STARTED"}
        onChange={handleSwitchChange}
        checked={state.accountTokenized}
      />
      {state?.accountTokenized && (
        <Typography sx={{ my: 2 }} variant="body2" component="p">
          Token {state?.token && state.token}
        </Typography>
      )}
      <Button onClick={more}>more info</Button>
    </>
  );
};

export default TokenizeAccount;
