import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_MAP } from "../config";

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

export const useContract = (contractName) => {
  if (!Object.keys(CONTRACT_MAP).includes(contractName))
    throw new Error(`Contract: ${contractName} is not configured`);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const { address, abi } = CONTRACT_MAP[contractName];
  const contract = new ethers.Contract(address, abi, provider.getSigner());

  useEffect(() => {
    provider.on("pending", (tx) => {
      console.log(tx);
    });

    provider.on("block", (blockNumber) => {
      console.log(blockNumber);
    });
  }, []);

  return {
    contract,
  };
};
