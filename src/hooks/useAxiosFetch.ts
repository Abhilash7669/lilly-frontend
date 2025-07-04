"use client";

import { AXIOS_CLIENT } from "@/lib/api/client/axios.client";
import { BasicResponse } from "@/lib/types/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function useAxiosFetch<T>(
  endpoint: string,
  initialState?: T,
  dataKey?: string
): {
  data: T;
  setData: React.Dispatch<React.SetStateAction<T>>;
} {
  const [data, setData] = useState<T>(initialState as T);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const response = await AXIOS_CLIENT.get<BasicResponse<Record<string, T>>>(endpoint);

      if (!response) return;

      if (!response.success && response.status_code === 401) {
        router.push("/login");
        return;
      }

      if (!response.data) {
        setData(() => initialState as T);
        return;
      };
      
      const dataObj = response.data;

      if(dataKey) {
        setData(() => dataObj[dataKey] as T);
        return;
      }

      setData(() => response.data as T);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    data,
    setData,
  };
}
