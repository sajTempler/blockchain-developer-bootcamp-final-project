import { useEffect } from "react";
import { ACTIONS } from "../state/actions";
import { useApp } from "../state/app.context";
import { useAccount } from "../state/hooks";

export const useAccountPutForSaleListener = (contract, setLoading) => {
  const { dispatch } = useApp();
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
          dispatch({
            type: ACTIONS.FORCE_REFRESH,
          });
        }
      };

      contract.on("AccountPutForSale", callback);
      return () => contract.removeListener("AccountPutForSale", callback);
    }
  }, [contract, selectedAccount]);
};
