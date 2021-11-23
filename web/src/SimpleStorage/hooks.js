import { useEffect } from "react";
import { ethers } from "ethers";
import { SIMPLE_STORAGE } from "./actions";
import { useSimpleStorage } from "./context";
import { CONTRACT_MAP } from "../config";

export const useSimpleStorageContract = () => {
  const { dispatch } = useSimpleStorage();
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const { address, abi } = CONTRACT_MAP["SimpleStorage"];
  const contract = new ethers.Contract(address, abi, provider.getSigner());

  useEffect(() => {
    const pollValue = async () => {
      const val = await contract.retrieve().catch(console.error);
      dispatch({
        type: SIMPLE_STORAGE.SET_VALUE,
        payload: val?.toString() ?? "",
      });
      dispatch({
        type: SIMPLE_STORAGE.SET_PENDING,
        payload: false,
      });
    };

    provider.on("block", (blockNumber) => {
      console.log(blockNumber);
      pollValue();
    });
  }, []);

  return {
    contract,
  };
};
