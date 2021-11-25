import React from "react";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

import { useTokenizeAccount } from "./context";
import {
  useAccountTokenizedListener,
  useInitAccountToken,
  useTokenizeAccountContract,
} from "./hooks";
import { TOKENIZE_ACCOUNT } from "./actions";

const TokenizeAccount = () => {
  // example user id from any platform
  const userId = "12345";
  const { selectedAccount, contract } = useTokenizeAccountContract();
  const { state, dispatch } = useTokenizeAccount();
  useAccountTokenizedListener(contract, dispatch);
  useInitAccountToken(contract, dispatch);

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
      .catch((e) => {
        console.error("tokenize e", e);
        dispatch({
          type: TOKENIZE_ACCOUNT.ERROR,
          error: e?.data?.message ?? "Unknown error",
        });
      });
  };

  return (
    <>
      <Typography sx={{ my: 2 }} variant="h5" component="div">
        {state.accountTokenized ? "Account tokenized" : "Tokenize account"}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Switch
          disabled={
            state.accountTokenized || state.status === "TOKENIZE_STARTED"
          }
          onChange={handleSwitchChange}
          checked={state.accountTokenized}
        />
        {state.status === "TOKENIZE_STARTED" && <CircularProgress size={"2rem"} />}
      </Box>

      {state?.accountTokenized && (
        <Typography sx={{ my: 2 }} variant="body2" component="p">
          Token {state?.token && state.token}
        </Typography>
      )}
      {state?.error && (
        <Typography
          sx={{ my: 2, color: "crimson" }}
          variant="body2"
          component="p"
        >
          {state.error}
        </Typography>
      )}
    </>
  );
};

export default TokenizeAccount;
