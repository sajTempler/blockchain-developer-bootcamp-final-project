import React from "react";
import { TextField, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useForm } from "react-hook-form";

import Box from "@mui/material/Box";
import { useSimpleStorage } from "./context";
import { useSimpleStorageContract } from "./hooks";
import { SIMPLE_STORAGE } from "./actions";

const SimpleStorage = () => {
  const { contract } = useSimpleStorageContract();
  const { state, dispatch } = useSimpleStorage();

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (form) => {
    dispatch({
      type: SIMPLE_STORAGE.SET_PENDING,
      payload: true,
    });
    await contract.store(form.storage).catch((e) => {
      dispatch({
        type: SIMPLE_STORAGE.SET_PENDING,
        payload: false,
      });
      console.error(e);
    });
    reset();
  };

  return (
    <>
      <Typography variant="h5" component="div">
        SimpleStorage
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography sx={{ marginRight: "2rem" }} variant="body1" component="p">
          Current value: {state?.storedValue ?? ""}
        </Typography>
        <form
          style={{ display: "flex", alignItems: "center" }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextField
            {...register("storage", {
              valueAsNumber: true,
              required: true,
            })}
            label="New value"
            type="number"
          />
          <LoadingButton loading={state.pendingTx} type="submit">
            Set
          </LoadingButton>
        </form>
      </Box>
    </>
  );
};

export default SimpleStorage;
