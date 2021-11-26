import { faEthereum } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Grid, Paper, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import Identicon from "react-identicons";
import { useApp } from "../state/app.context";
import { useTokenizeAccountContract } from "../TokenizeAccount/hooks";

const commonSx = {
  display: "flex",
  m: 1,
  width: "10rem",
  height: "10rem",
};

const MyOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState({ offers: "IDLE", buy: "IDLE" }); // "IDLE" | "PENDING" | "LOADED" | "ERROR"
  const [errors, setErrors] = useState({});
  const { contract, selectedAccount } = useTokenizeAccountContract();
  const {
    state: { forceRefresh },
  } = useApp();

  useEffect(() => {
    setLoading((prev) => ({ ...prev, offers: "PENDING" }));
    contract
      .myOffersForSale()
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
        setErrors({
          offers: undefined,
        });
      })
      .catch((e) => {
        if (e?.data?.message?.includes("no offers")) {
          setOffers([]);
        } else {
          setErrors({
            offers: e?.data?.message,
          });
        }
      });
  }, [contract, selectedAccount, forceRefresh]);

  const remove = () => {
    // todo remove
    alert("not implemented yet");
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
                <Button
                  variant="danger"
                  disabled={offer.sold || loading.buy === "PENDING"}
                  onClick={() => remove(offer)}
                >
                  REMOVE
                </Button>
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

export default MyOffers;
