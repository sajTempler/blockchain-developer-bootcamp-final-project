import React, { useReducer, useContext, createContext } from "react";
import { TOKENIZE_ACCOUNT } from "./actions";

const TokenizeAccountContext = createContext();

const initialState = {
  token: "",
  pendingTx: false,
};

function reducer(state, { type, payload, error }) {
  switch (type) {
    case TOKENIZE_ACCOUNT.SET_VALUE: {
      return {
        ...state,
        token: payload,
      };
    }
    case TOKENIZE_ACCOUNT.SET_PENDING: {
      return {
        ...state,
        pendingTx: payload,
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${type}`);
    }
  }
}

function TokenizeAccountProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  // TODO: might need memoization
  const value = { state, dispatch };
  return (
    <TokenizeAccountContext.Provider value={value}>
      {children}
    </TokenizeAccountContext.Provider>
  );
}

function useTokenizeAccount() {
  const context = useContext(TokenizeAccountContext);
  if (context === undefined) {
    throw new Error(
      "useTokenizeAccount must be used within a TokenizeAccountProvider"
    );
  }
  return context;
}

export { TokenizeAccountProvider, useTokenizeAccount };
