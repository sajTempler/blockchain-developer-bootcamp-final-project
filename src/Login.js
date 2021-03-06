import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";

import InstallMetamaskModal from "./InstallMetamaskModal";
import { useProvider } from "./state/hooks";

const Login = () => {
  const history = useHistory();
  const [modalOpened, setModalOpened] = useState(false);
  const { provider } = useProvider();

  const login = () => {
    history.push("/profile");
  };

  const metamaskLogin = async () => {
    if (!window?.ethereum) {
      setModalOpened(true);
    } else {
      try {
        await provider?.send("eth_requestAccounts", []);
        login();
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <>
      <Container maxWidth="sm">
        <h1>Login</h1>
        <Stack spacing={2}>
          <TextField disabled label="Username" variant="outlined" />
          <TextField
            disabled
            type="password"
            label="Password"
            variant="outlined"
          />
          {/* <Button onClick={login} variant="outlined">
            Login
          </Button> */}
          <Button onClick={() => metamaskLogin()} variant="outlined">
            Connect Metamask
          </Button>
        </Stack>
      </Container>
      <InstallMetamaskModal
        open={modalOpened}
        onClose={() => setModalOpened(false)}
      />
    </>
  );
};

export default Login;
