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
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";

import Switch from "@mui/material/Switch";
import { useBalance } from "./state/hooks";
import { useApp } from "./state/app.context";

const centerStyles = {
  alignItems: "center",
  justifyContent: "center",
};

const Profile = () => {
  const history = useHistory();
  const logout = () => {
    history.push("/");
  };

  const { state } = useApp();
  const { balance } = useBalance();

  const [checked, setChecked] = useState(false);

  const handleSwitchChange = ({ target }) => {
    console.log(target.value);
    setChecked((prev) => !prev);
  };

  return (
    <Grid container spacing={2}>
      <Grid
        container
        style={{ ...centerStyles, padding: "2rem 0" }}
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
            <Typography variant="h5" component="div">
              Tokenize account
            </Typography>
            <Switch onChange={handleSwitchChange} checked={checked} />
            {checked && (
              <Typography variant="body2" component="p">
                Token 123123123123123123
              </Typography>
            )}
          </CardContent>
          <CardActions>
            <Button size="small">Learn More</Button>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Profile;
