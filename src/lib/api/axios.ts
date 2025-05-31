import { ENV } from "@/lib/config/env.config";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

export const AXIOS = {
  get: async function <T>(url: string): Promise<T> {
    try {
      const m_data = await axios.get<T>(`${ENV.BASEURL}${url}`);
      return m_data.data;
    } catch (error) {
      console.error(error);
      throw error as AxiosError;
    }
  },
  post: async function <T, U>(
    url: string,
    data: T,
    config: AxiosRequestConfig
  ): Promise<U> {
    try {
      const m_data = await axios.post<U>(`${ENV.BASEURL}${url}`, data, config);
      return m_data.data;
    } catch (error) {
      console.error(error);
      throw error as AxiosError;
    }
  },
};
