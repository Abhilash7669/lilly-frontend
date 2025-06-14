import { ENV } from "@/lib/config/env.config";
import { getCookie } from "@/lib/cookies/cookie";
import axios, { AxiosError, AxiosRequestConfig } from "axios";


export const AXIOS = {
  get: async function <T>(url: string): Promise<T> {

    const token = await getCookie();

    try {
      const m_data = await axios.get<T>(`${ENV.BASEURL}${url}`, {
        headers: {
          "Authorization" : `Bearer ${token ? token : null}`
        }
      });
      return m_data.data;
    } catch (error) {
      console.error(error);
      throw error as AxiosError;
    }
  },
  post: async function <T, U>(
    url: string,
    data: T,
    config?: AxiosRequestConfig
  ): Promise<U> {

    const token = await getCookie();

    try {
      const m_data = await axios.post<U>(`${ENV.BASEURL}${url}`, data, {
        method: "POST",
        headers: {
          "Authorization" : `Bearer ${token ? token : null}`
        },
        ...config,
      });
      return m_data.data;
    } catch (error) {
      console.error(error);
      throw error as AxiosError;
    }
  },
};
