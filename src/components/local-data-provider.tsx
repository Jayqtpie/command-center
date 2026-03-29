"use client";

import { createContext, useContext, useEffect, useState } from "react";

type LocalData = {
  metrics: Record<string, Record<string, unknown>>;
  config: {
    goals?: {
      instagram?: { target: number; label: string } | null;
      youtube?: { target: number; label: string } | null;
      tiktok?: { target: number; label: string } | null;
    };
  } | null;
};

const LocalDataContext = createContext<LocalData>({
  metrics: {},
  config: null,
});

export function useLocalData() {
  return useContext(LocalDataContext);
}

export function LocalDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<LocalData>({ metrics: {}, config: null });

  useEffect(() => {
    const ig = JSON.parse(localStorage.getItem("cc:metrics:ig") || "{}");
    const yt = JSON.parse(localStorage.getItem("cc:metrics:yt") || "{}");
    const tt = JSON.parse(localStorage.getItem("cc:metrics:tt") || "{}");
    const config = JSON.parse(localStorage.getItem("cc:config") || "null");
    setData({ metrics: { ig, yt, tt }, config });
  }, []);

  return (
    <LocalDataContext.Provider value={data}>
      {children}
    </LocalDataContext.Provider>
  );
}
