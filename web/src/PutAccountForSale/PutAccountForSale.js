import React, { useState, useEffect } from "react";
import { TextField, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useForm } from "react-hook-form";
import Box from "@mui/material/Box";

import { useTokenizeAccountContract } from "../TokenizeAccount/hooks";
import { useTokenizeAccount } from "../TokenizeAccount/context";
import { ethers } from "ethers";
import { useAccountPutForSaleListener } from "./hooks";

const PutAccountForSale = () => {
  const [loading, setLoading] = useState("IDLE"); // "IDLE" | "PENDING" | "LOADED" | "ERROR"
  const [error, setError] = useState();
  const { state } = useTokenizeAccount();
  const { selectedAccount, contract } = useTokenizeAccountContract();
  useAccountPutForSaleListener(contract, setLoading);
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (form) => {
    setLoading("PENDING");

    const price = ethers.utils.parseEther(form.amount);

    contract
      .retrieveMyToken(selectedAccount)
      .then((token) => `${token}`)
      .then((tokenId) => {
        contract
          .addAccountForSale(price, tokenId)
          .then(() => {
            setError();
          })
          .catch((e) => {
            setError(e?.data?.message ?? "Unknown error");
          });
      })
      .catch((e) => {
        setLoading("ERROR");
        setError(e?.data?.message ?? "Unknown error");
        console.error(e);
      });

    reset();
  };

  useEffect(() => {
    setLoading("IDLE");
    setError();
  }, [selectedAccount]);

  return (
    <>
      <Typography sx={{ my: 2 }} variant="h5" component="div">
        Put account for sale
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <form
          style={{ display: "flex", alignItems: "center" }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextField
            {...register("amount", {
              required: true,
            })}
            label="Amount (Eth)"
            type="text"
            disabled={!state?.accountTokenized || loading === "LOADED"}
          />
          <LoadingButton
            disabled={!state?.accountTokenized || loading === "LOADED"}
            loading={loading === "PENDING"}
            type="submit"
          >
            Add for sale
          </LoadingButton>
        </form>
        {error && (
          <Typography
            sx={{ my: 2, color: "crimson" }}
            variant="body2"
            component="p"
          >
            {error}
          </Typography>
        )}
      </Box>
    </>
  );
};

export default PutAccountForSale;
