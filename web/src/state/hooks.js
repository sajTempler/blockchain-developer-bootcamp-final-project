import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useApp } from "./app.context";

export const useBalance = () => {
  const [balance, setBalance] = useState("n/a");
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  useEffect(() => {
    if (provider) {
      const getBalance = async () => {
        const address = await provider.listAccounts();
        const ethBalance = await provider.getBalance(address[0]);
        setBalance(ethers.utils.formatEther(ethBalance));
      };

      getBalance();
    }
  }, [provider]);

  return {
    balance,
  };
};
