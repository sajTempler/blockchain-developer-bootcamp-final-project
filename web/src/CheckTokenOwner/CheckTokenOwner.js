import React, { useState, useEffect } from "react";
import { TextField, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useForm } from "react-hook-form";
import Box from "@mui/material/Box";

import { useTokenizeAccountContract } from "../TokenizeAccount/hooks";

const CheckTokenOwner = () => {
  const [loading, setLoading] = useState("IDLE"); // "IDLE" | "PENDING" | "LOADED" | "ERROR"
  const [owner, setOwner] = useState();
  const { selectedAccount, contract } = useTokenizeAccountContract();
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (form) => {
    setLoading("PENDING");
    contract
      .ownerOf(form.token)
      .then((ownerAddress) => {
        setLoading("LOADED");
        setOwner(ownerAddress);
      })
      .catch((e) => {
        setLoading("ERROR");
        setOwner();
        console.error(e);
      });
    reset();
  };

  useEffect(() => {
    setLoading("IDLE");
    setOwner();
  }, [selectedAccount]);

  return (
    <>
      <Typography sx={{ my: 2 }} variant="h5" component="div">
        Check Token Owner
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <form
          style={{ display: "flex", alignItems: "center" }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextField
            {...register("token", {
              required: true,
            })}
            label="Token"
            type="text"
          />
          <LoadingButton loading={loading === "PENDING"} type="submit">
            Check
          </LoadingButton>
        </form>
        {owner && (
          <Typography sx={{ my: 2 }} variant="body2" component="p">
            Owner is: {owner}
          </Typography>
        )}
      </Box>
    </>
  );
};

export default CheckTokenOwner;
