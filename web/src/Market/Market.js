import { faEthereum } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Grid, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import Identicon from "react-identicons";
import { useTokenizeAccountContract } from "../TokenizeAccount/hooks";

const commonSx = {
  display: "flex",
  m: 1,
  width: "10rem",
  height: "10rem",
};

const Market = () => {
  const [offers, setOffers] = useState([]);
  const { contract } = useTokenizeAccountContract();

  useEffect(() => {
    contract
      .tokensForSale()
      .then((tokensForSaleBn) => {
        const tokensForSale = tokensForSaleBn.map((t) => `${t}`);
        console.log("offersCount", tokensForSale);

        const promises = tokensForSale.map((t) => contract.offer(t));

        Promise.allSettled(promises)
          .then((res) => {
            return res.map(({ value, status }, i) => {
              if (status === "fulfilled") {
                return {
                  tokenId: tokensForSale[i],
                  price: ethers.utils.formatEther(value.price.toString()),
                  seller: value.seller,
                  sold: value.sold,
                };
              }
              return false;
            });
          })
          .then((res) => res.filter(Boolean))
          .then((_offers) => setOffers(_offers))
          .catch(console.error);
      })
      .catch(console.error);
  }, [contract]);

  const buy = (offer) => {
    console.log(`About to buy ${offer.tokenId}`);
    contract
      .buyAccount(offer.tokenId, {
        value: ethers.utils.parseEther(offer.price),
      })
      .then(console.log)
      .catch(console.error);
  };

  return (
    <Grid container spacing={2}>
      {offers.map((offer) => {
        return (
          <Grid key={offer.seller} item xs={4}>
            <Paper
              sx={{
                ...commonSx,
              }}
              variant="outlined"
              square
            >
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                  flexDirection: "column",
                }}
              >
                <Box sx={{ border: "solid 1px rgba(0, 0, 0, 0.12)" }}>
                  <Identicon size={64} string={offer.tokenId} />
                </Box>
                <Box>
                  <Typography variant="h6" component="span">
                    {offer.price}
                  </Typography>
                  <FontAwesomeIcon
                    style={{ fontSize: "1rem", marginLeft: ".5rem" }}
                    icon={faEthereum}
                  />
                </Box>
                <Button disabled={offer.sold} onClick={() => buy(offer)}>
                  {offer.sold ? "SOLD" : "BUY"}
                </Button>
              </Box>
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default Market;
