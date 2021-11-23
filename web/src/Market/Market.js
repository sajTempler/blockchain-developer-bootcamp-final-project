import { Grid, Paper } from "@mui/material";
import React, { useEffect } from "react";
import { useTokenizeAccountContract } from "../TokenizeAccount/hooks";

const commonSx = {
  display: "flex",
  m: 1,
  width: "10rem",
  height: "10rem",
};

const Market = () => {
  const { contract } = useTokenizeAccountContract();

  useEffect(() => {
    contract.offers(1).then((res) => {
      console.log("offers", res);
    });
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <Paper
          sx={{
            ...commonSx,
          }}
          variant="outlined"
          square
        />
      </Grid>
      <Grid item xs={4}>
        <Paper
          sx={{
            ...commonSx,
          }}
          variant="outlined"
          square
        />
      </Grid>
      <Grid item xs={4}>
        <Paper
          sx={{
            ...commonSx,
          }}
          variant="outlined"
          square
        />
      </Grid>
    </Grid>
  );
};

export default Market;
