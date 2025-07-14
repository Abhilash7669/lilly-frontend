import { ENV } from "@/lib/config/env.config";
import { getCookie } from "@/lib/cookies/cookie";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

type CustomResponse = {
  success: boolean;
  title: string;
  message: string;
  status_code: number;
};

export const AXIOS_SERVER = {
  post: async function <T, U>(
    url: string,
    data: T,
    config?: AxiosRequestConfig
  ): Promise<U> {
    const token = await getCookie("lillyToken");

    try {
      const m_data = await axios.post<U & CustomResponse>(
        `${ENV.BASEURL}${url}`,
        data,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token ? token : null}`,
          },
          signal: AbortSignal.timeout(5000),
          timeoutErrorMessage: "Request Timed out",
          ...config,
        }
      );

      return m_data.data;
    } catch (error) {
      const axiosError = error as AxiosError<CustomResponse>;
      throw axiosError;
    }
  },
};
