import React, { useReducer, useContext, createContext } from "react";
import { SIMPLE_STORAGE } from "./actions";

const SimpleStorageContext = createContext();

const initialState = {
  storedValue: "",
  pendingTx: false,
};

function reducer(state, { type, payload, error }) {
  switch (type) {
    case SIMPLE_STORAGE.SET_VALUE: {
      return {
        ...state,
        storedValue: payload,
      };
    }
    case SIMPLE_STORAGE.SET_PENDING: {
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

function SimpleStorageProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  // TODO: might need memoization
  const value = { state, dispatch };
  return (
    <SimpleStorageContext.Provider value={value}>
      {children}
    </SimpleStorageContext.Provider>
  );
}

function useSimpleStorage() {
  const context = useContext(SimpleStorageContext);
  if (context === undefined) {
    throw new Error(
      "useSimpleStorage must be used within a SimpleStorageProvider"
    );
  }
  return context;
}

export { SimpleStorageProvider, useSimpleStorage };
