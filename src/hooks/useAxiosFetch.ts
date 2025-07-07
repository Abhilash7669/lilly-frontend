"use client";

import { AXIOS_CLIENT } from "@/lib/api/client/axios.client";
import { BasicResponse } from "@/lib/types/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function useAxiosFetch<T>(
  endpoint: string,
  initialState?: T,
  dataKey?: string,
  hasData?: boolean,
): {
  data: T;
  setData: React.Dispatch<React.SetStateAction<T>>;
  loading: boolean,
} {
  const [data, setData] = useState<T>(initialState as T);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if(hasData) return;
    (async () => {
      setLoading(() => true);
      const response = await AXIOS_CLIENT.get<BasicResponse<Record<string, T>>>(endpoint);

      if (!response) {
        setLoading(() => false);
        return;
      }
      
      if (!response.success && response.status_code === 401) {
        setLoading(() => false);
        router.push("/login");
        return;
      }
      
      if (!response.data) {
        setLoading(() => false);
        setData(() => initialState as T);
        return;
      };
      
      const dataObj = response.data;
      
      if(dataKey) {
        setLoading(() => false);
        setData(() => dataObj[dataKey] as T);
        return;
      }
      
      setLoading(() => false);
      setData(() => response.data as T);
    })();

    return () => {
      setLoading(() => true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasData]);

  return {
    data,
    setData,
    loading
  };
}
