import React, { useState } from "react";
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
import { TokenizeAccountProvider } from "./TokenizeAccount/context";
import TokenizeAccount from "./TokenizeAccount/TokenizeAccount";
import CheckTokenOwner from "./CheckTokenOwner/CheckTokenOwner";
import IconButton from "@mui/material/IconButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Tooltip } from "@mui/material";
import PutAccountForSale from "./PutAccountForSale/PutAccountForSale";
import Market from "./Market/Market";
import MyOffers from "./MyOffers/MyOffers";

const centerStyles = {
  alignItems: "center",
  justifyContent: "center",
};

const Profile = () => {
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const logout = () => {
    history.push("/");
  };

  const { balance, selectedAccount } = useAccount();

  const copy = () => {
    setOpen(true);
    navigator.clipboard.writeText(selectedAccount);
    setTimeout(() => {
      setOpen(false);
    }, 1000);
  };

  return (
    <Grid container spacing={2}>
      <Grid container sx={{ ...centerStyles, my: 4 }} item xs={4}>
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
            <ListItemText sx={{ flex: 1 }} primary="Account" />
            <Typography
              sx={{ flex: 2, overflow: "hidden", textOverflow: "ellipsis" }}
              variant="span"
            >
              {selectedAccount}
            </Typography>
            <Tooltip
              PopperProps={{
                disablePortal: true,
              }}
              open={open}
              disableFocusListener
              disableHoverListener
              disableTouchListener
              title="Copied!"
            >
              <IconButton
                aria-label="copy account"
                component="span"
                onClick={copy}
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </ListItem>
          <ListItem button>
            <ListItemText primary="Settings" />
          </ListItem>
          <ListItem button>
            <ListItemText primary="Marketplace" />
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

            <TokenizeAccountProvider>
              <TokenizeAccount />
              <PutAccountForSale />
              <CheckTokenOwner />
            </TokenizeAccountProvider>
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 275, my: 4 }}>
          <CardContent>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              My account for sale
            </Typography>
            <MyOffers />
          </CardContent>
        </Card>
        <Card sx={{ minWidth: 275, my: 4 }}>
          <CardContent>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Market
            </Typography>
            <Market />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Profile;
