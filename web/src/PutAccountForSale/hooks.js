import { useEffect } from "react";
import { useAccount } from "../state/hooks";

export const useAccountPutForSaleListener = (contract, setLoading) => {
  const { selectedAccount } = useAccount();
  useEffect(() => {
    if (contract && selectedAccount) {
      const callback = (token, owner, event) => {
        if (owner === selectedAccount) {
          console.log(
            "useAccountPutForSaleListener AccountPutForSale event",
            event
          );
          console.log(
            `useAccountPutForSaleListener AccountPutForSale ${token}`
          );
          setLoading("LOADED");
        }
      };

      contract.on("AccountPutForSale", callback);
      return () => contract.removeListener("AccountPutForSale", callback);
    }
  }, [contract, selectedAccount]);
};
