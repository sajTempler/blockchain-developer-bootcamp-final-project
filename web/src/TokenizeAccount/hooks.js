import { useEffect, useState, useMemo } from "react";
import { ethers } from "ethers";
import { useTokenizeAccount } from "./context";
import { CONTRACT_MAP } from "../state/config";

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
  const [selectedAccount, setSelectedAccount] = useState("");
  const { dispatch } = useTokenizeAccount();
  const { provider } = useProvider();
  const { address, abi } = CONTRACT_MAP["TokenizeAccount"];
  const contract = new ethers.Contract(address, abi, provider.getSigner());

  useEffect(() => {
    const getBalance = async () => {
      const addresses = await provider.listAccounts();
      setSelectedAccount(addresses[0]);
      const balance = (await contract.balanceOf(addresses[0])).toString();
      console.log("balance", balance);
    };

    getBalance().catch(console.error);
  });

  return {
    contract,
    selectedAccount,
  };
};
