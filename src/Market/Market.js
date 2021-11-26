import { faEthereum } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LoadingButton } from "@mui/lab";
import { Grid, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import Identicon from "react-identicons";
import { useApp } from "../state/app.context";
import { useTokenizeAccountContract } from "../TokenizeAccount/hooks";
import { useAccountBoughtListener } from "./hooks";

const commonSx = {
  display: "flex",
  m: 1,
  width: "10rem",
  height: "10rem",
};

const Market = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState({ offers: "IDLE", buy: "IDLE" }); // "IDLE" | "PENDING" | "LOADED" | "ERROR"
  const [errors, setErrors] = useState({});
  const { contract, selectedAccount } = useTokenizeAccountContract();
  const {
    state: { forceRefresh },
  } = useApp();

  const resetOffers = () => {
    setOffers([]);
  };

  useAccountBoughtListener(contract, setLoading, resetOffers);

  useEffect(() => {
    setLoading((prev) => ({ ...prev, offers: "PENDING" }));
    contract
      .myOffers()
      .then((myOffer) => {
        console.log("myOffer", myOffer);
        setOffers([
          {
            tokenId: myOffer.tokenId,
            price: ethers.utils.formatEther(myOffer.price.toString()),
            seller: myOffer.seller,
          },
        ]);
        setLoading((prev) => ({ ...prev, offers: "LOADED" }));
      })
      .catch((e) => {
        if (e?.data?.message?.includes("no offers")) {
          setOffers([]);
        }
      });
  }, [contract, selectedAccount, forceRefresh]);

  const buy = (offer) => {
    console.log(`About to buy ${offer.tokenId}`);
    setLoading((prev) => ({ ...prev, buy: "PENDING" }));
    contract
      .buyAccount(offer.tokenId, {
        value: ethers.utils.parseEther(offer.price),
      })
      .then((res) => {
        console.log("buy", res);
        setErrors((prev) => ({
          ...prev,
          buy: undefined,
        }));
      })
      .catch((e) => {
        setLoading((prev) => ({ ...prev, buy: "ERROR" }));
        setErrors((prev) => ({
          ...prev,
          buy: e?.data?.message ?? "Unknown error",
        }));
        console.error(e);
      });
  };

  return (
    <Grid container spacing={2}>
      {offers.map((offer) => {
        return (
          <Grid key={offer.tokenId} item xs={4}>
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
                <LoadingButton
                  loading={loading.buy === "PENDING"}
                  disabled={loading.buy === "PENDING"}
                  onClick={() => buy(offer)}
                >
                  BUY
                </LoadingButton>
              </Box>
            </Paper>
            {errors?.buy && (
              <Typography
                sx={{ my: 2, color: "crimson" }}
                variant="body2"
                component="p"
              >
                {errors?.buy}
              </Typography>
            )}
          </Grid>
        );
      })}
    </Grid>
  );
};

export default Market;
