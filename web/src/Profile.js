import React from "react";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";

import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import PersonIcon from "@mui/icons-material/Person";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import { useAccount } from "./state/hooks";
import SimpleStorage from "./SimpleStorage/SimpleStorage";
import { SimpleStorageProvider } from "./SimpleStorage/context";
import { TokenizeAccountProvider } from "./TokenizeAccount/context";
import TokenizeAccount from "./TokenizeAccount/TokenizeAccount";
import CheckTokenOwner from "./CheckTokenOwner/CheckTokenOwner";

const centerStyles = {
  alignItems: "center",
  justifyContent: "center",
};

const Profile = () => {
  const history = useHistory();
  const logout = () => {
    history.push("/");
  };

  const { balance, selectedAccount } = useAccount();

  return (
    <Grid container spacing={2}>
      <Grid
        container
        sx={{ ...centerStyles, my: 4 }}
        item
        xs={4}
      >
        <Avatar sx={{ width: 100, height: 100 }}>
          <PersonIcon fontSize="large" />
        </Avatar>
      </Grid>
      <Grid container item style={{ alignItems: "center" }} xs={8}>
        <Typography variant="h2">Settings</Typography>
      </Grid>
      <Grid item xs={4}>
        <List component="nav" aria-label="mailbox folders">
          <ListItem>
            <ListItemText primary="Balance" />
            <>
              <Typography variant="h6" component="span">
                {balance}
              </Typography>
              <FontAwesomeIcon
                style={{ fontSize: "1rem", marginLeft: ".5rem" }}
                icon={faEthereum}
              />
            </>
          </ListItem>
          <ListItem>
            <ListItemText sx={{flex: 1}} primary="Account" />
            <Typography
              sx={{ flex: 2, overflow: "hidden", textOverflow: "ellipsis" }}
              variant="span"
            >
              {selectedAccount}
            </Typography>
          </ListItem>
          <ListItem button>
            <ListItemText primary="Settings" />
          </ListItem>
          <Divider />
          <ListItem onClick={logout} button divider>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Grid>
      <Grid item xs={8}>
        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Ethereum options
            </Typography>

            {/* <SimpleStorageProvider>
              <SimpleStorage />
            </SimpleStorageProvider> */}

            <TokenizeAccountProvider>
              <TokenizeAccount />
              <CheckTokenOwner />
            </TokenizeAccountProvider>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Profile;
