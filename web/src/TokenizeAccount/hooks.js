import { useEffect, useMemo } from "react";
import { ethers } from "ethers";
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
  const contract = useMemo(
    () => new ethers.Contract(address, abi, provider.getSigner()),
    [provider]
  );

  return {
    contract,
    selectedAccount,
  };
};

export const useAccountTokenizedListener = (contract, dispatch) => {
  const { selectedAccount } = useAccount();
  useEffect(() => {
    if (contract && selectedAccount) {
      // A filter for when a specific address receives tokens
      // const filter = contract.filters.AccountTokenized(selectedAccount);

      const callback = (token, owner, event) => {
        if (owner === selectedAccount) {
          console.log("useAccountTokenizedListener AccountTokenized event", event);
          console.log(`useAccountTokenizedListener Tokenized ${token}`);
          dispatch({
            type: TOKENIZE_ACCOUNT.SET_TOKEN,
            payload: { token: `${token}` },
          });
        }
      };

      contract.on("AccountTokenized", callback);
      return () => contract.removeListener("AccountTokenized", callback);
    }
  }, [contract, selectedAccount]);
};

export const useInitAccountToken = (contract, dispatch) => {
  const { selectedAccount } = useAccount();
  useEffect(() => {
    if (contract && selectedAccount) {
      contract
        .retrieveMyAccountTokens(selectedAccount)
        .then((token) => {
          // "0" indicates no tokens for account
          if (`${token}` !== "0") {
            dispatch({
              type: TOKENIZE_ACCOUNT.SET_TOKEN,
              payload: { token: `${token}` },
            });
          } else {
            dispatch({
              type: TOKENIZE_ACCOUNT.SET_TOKEN,
              payload: { token: "", accountTokenized: false },
            });
          }
        })
        .catch(console.error);
    }
  }, [contract, selectedAccount]);
};
