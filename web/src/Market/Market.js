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
    contract
      .offersCount()
      .then((offersCount) => {
        const count = +`${offersCount}`;
        console.log("offersCount", `${offersCount}`);

        if (count > 0) {
          const promises = new Array(count).map((_, i) => {
            return contract.offers(0);
          });

          Promise.allSettled(promises)
            .then((res) => {
              console.log(res);
            })
            .catch(console.error);
        }
      })
      .catch(console.error);
  }, [contract]);

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
