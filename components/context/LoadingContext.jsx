"use client";

import { createContext, useContext, useState } from "react";

const LoadingContext = createContext();

export function LoadingProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("public"); // public | dashboard

  return (
    <LoadingContext.Provider
      value={{ loading, setLoading, type, setType }}
    >
      {children}
    </LoadingContext.Provider>
  );
}

export const useLoading = () => useContext(LoadingContext);
