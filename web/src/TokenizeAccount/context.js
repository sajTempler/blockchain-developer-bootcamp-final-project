import React, { useReducer, useContext, createContext } from "react";
import { TOKENIZE_ACCOUNT } from "./actions";

const TokenizeAccountContext = createContext();

const initialState = {
  token: "",
  accountTokenized: false,
  status: "IDLE", // "IDLE" | "TOKENIZE_STARTED" | "TOKENIZE_FINISHED" | "ERROR"
};

function reducer(state, { type, payload, error }) {
  console.log(`TokenizeAccountContext type: ${type}`, payload);
  switch (type) {
    case TOKENIZE_ACCOUNT.SET_TOKEN: {
      return {
        ...state,
        token: payload.token,
        accountTokenized: payload.accountTokenized ?? true,
      };
    }
    case TOKENIZE_ACCOUNT.SET_PENDING: {
      return {
        ...state,
        status: "TOKENIZE_STARTED",
      };
    }
    case TOKENIZE_ACCOUNT.SET_COMPLETED: {
      return {
        ...state,
        status: "TOKENIZE_FINISHED",
        accountTokenized: true,
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
