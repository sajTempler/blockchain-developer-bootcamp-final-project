import { useEffect } from "react";
import { ACTIONS } from "../state/actions";
import { useApp } from "../state/app.context";
import { useAccount } from "../state/hooks";

export const useAccountBoughtListener = (contract, setLoading, resetOffers) => {
  const { selectedAccount } = useAccount();
  const { dispatch } = useApp();
  useEffect(() => {
    if (contract && selectedAccount) {
      const callback = (token, owner, event) => {
        if (owner === selectedAccount) {
          console.log("useAccountBoughtListener AccountBought event", event);
          console.log(`useAccountBoughtListener AccountBought ${token}`);
          setLoading((prev) => ({ ...prev, buy: "LOADED" }));
          resetOffers();
          dispatch({
            type: ACTIONS.FORCE_REFRESH,
          });
        }
      };

      contract.on("AccountBought", callback);
      return () => contract.removeListener("AccountBought", callback);
    }
  }, [contract, selectedAccount]);
};
