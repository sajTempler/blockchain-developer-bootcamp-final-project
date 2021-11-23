import { useEffect, useState, useMemo } from "react";
import { ethers } from "ethers";
import { useTokenizeAccount } from "./context";
import { CONTRACT_MAP } from "../config";
import { TOKENIZE_ACCOUNT } from "./actions";
import { useAccount } from "../state/hooks";

export const useProvider = () => {
  const provider = useMemo(
    () => new ethers.providers.Web3Provider(window.ethereum),
    []
  );

  return {
    provider,
  };
};

export const useTokenizeAccountContract = () => {
  const { provider } = useProvider();
  const { selectedAccount } = useAccount();
  const { address, abi } = CONTRACT_MAP["TokenizeAccount"];
  const contract = new ethers.Contract(address, abi, provider.getSigner());

  return {
    contract,
    selectedAccount,
  };
};

export const useAccountTokenizedListener = (
  contract,
  selectedAccount,
  dispatch
) => {
  useEffect(() => {
    if (contract && selectedAccount) {
      // A filter for when a specific address receives tokens
      // const filter = contract.filters.AccountTokenized(selectedAccount);

      const callback = (token, event) => {
        console.log("AccountTokenized event", event);
        console.log(`Tokenized ${token}`);
        dispatch({
          type: TOKENIZE_ACCOUNT.SET_TOKEN,
          payload: { token: `${token}` },
        });
      };

      contract.on("AccountTokenized", callback);
      return () => contract.removeListener("AccountTokenized", callback);
    }
  }, [contract, selectedAccount]);
};

export const useInitAccountToken = (contract, selectedAccount, dispatch) => {
  useEffect(() => {
    if (selectedAccount) {
      contract
        .retrieveMyAccountTokens(selectedAccount)
        .then((token) => {
          // "0" indicates no tokens for account
          if (`${token}` !== "0") {
            dispatch({
              type: TOKENIZE_ACCOUNT.SET_TOKEN,
              payload: { token: `${token}` },
            });
          }
        })
        .catch(console.error);
    }
  }, [selectedAccount]);
};
