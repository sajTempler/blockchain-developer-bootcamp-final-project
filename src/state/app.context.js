import React, { useReducer, useContext, createContext } from "react";
import { ACTIONS } from "./actions";

const AppContext = createContext();

const initialState = {
  tokenized: false,
  provider: null,
  forceRefresh: 2,
};

function appReducer(state, { type, payload, error }) {
  console.log(`AppContext type: ${type}`, payload);
  switch (type) {
    case ACTIONS.FORCE_REFRESH: {
      return {
        ...state,
        forceRefresh: state.forceRefresh + 1,
      };
    }
    case ACTIONS.ENABLE_METAMASK: {
      return {
        ...state,
      };
    }
    case ACTIONS.SET_PROVIDER: {
      return {
        ...state,
        provider: payload.provider,
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${type}`);
    }
  }
}

function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  // TODO: might need memoization
  const value = { state, dispatch };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within a AppProvider");
  }
  return context;
}

export { AppProvider, useApp };
