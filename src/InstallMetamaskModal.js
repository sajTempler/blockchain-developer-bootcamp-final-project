import React from "react";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const InstallMetamaskModal = ({ open, onClose }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          Metamask missing ?
        </Typography>
        <Typography style={{ marginBottom: "2rem" }} sx={{ mt: 2 }}>
          You do not have Metamask installed, or Metamask is disabled on this
          page.

          Install or enable Metamask and reload the page.
        </Typography>
        <Button
          onClick={() =>
            window.open("https://metamask.io/download.html", "_blank")
          }
          variant="contained"
          color="success"
        >
          Add Metamask Extension
        </Button>
      </Box>
    </Modal>
  );
};

export default InstallMetamaskModal;
