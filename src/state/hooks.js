import { useEffect, useState, useMemo } from "react";
import { ethers } from "ethers";
import { CONTRACT_MAP } from "../config";

export const useProvider = () => {
  const provider = useMemo(() => {
    try {
      return new ethers.providers.Web3Provider(window?.ethereum);
    } catch (e) {
      console.error(e);
      return {};
    }
  }, []);

  return {
    provider,
  };
};

export const useAccount = () => {
  const [balance, setBalance] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const { provider } = useProvider();

  useEffect(() => {
    const init = async () => {
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      const ethBalance = await provider.getBalance(address);
      setBalance(ethers.utils.formatEther(ethBalance));
      setSelectedAccount(address);
    };

    const callback = function () {
      init();
    };

    window.ethereum.on("accountsChanged", callback);

    init();
    return () => window.ethereum.removeListener("accountsChanged", callback);
  }, [provider]);

  return {
    balance,
    selectedAccount,
  };
};

export const useContract = (contractName) => {
  if (!Object.keys(CONTRACT_MAP).includes(contractName))
    throw new Error(`Contract: ${contractName} is not configured`);

  const { provider } = useProvider();
  const { address, abi } = CONTRACT_MAP[contractName];
  const contract = new ethers.Contract(address, abi, provider.getSigner());

  useEffect(() => {
    provider.on("pending", (tx) => {
      console.log(tx);
    });

    provider.on("block", (blockNumber) => {
      console.log(blockNumber);
    });

    return () => provider.removeAllListeners();
  }, [provider]);

  return {
    contract,
  };
};
