"use client";

import { ENV } from "@/lib/config/env.config";
import { getCookie } from "@/lib/cookies/cookie";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import qs from "qs";
import { toast } from "sonner";

type CustomResponse = {
  success: boolean;
  title: string;
  message: string;
  status_code: number;
};

export const AXIOS_CLIENT = {
  get: async function <T>(
    url: string,
    urlParams?: Record<string, unknown>
  ): Promise<T | null> {
    let m_urlParams;

    if (urlParams) m_urlParams = qs.stringify(urlParams);

    const token = await getCookie();

    try {
      const m_data = await axios.get<T & CustomResponse>(
        `${ENV.BASEURL}${url}`,
        {
          headers: {
            Authorization: `Bearer ${token ? token : null}`,
          },
          params: m_urlParams ?? null,
          signal: AbortSignal.timeout(5000),
          timeoutErrorMessage: "Request Timed out",
        }
      );

      toast(m_data.data.title || "Success", {
        description: m_data.data.message || "Welcome",
        duration: 3400,
        style: {
          background: "var(--custom-success)",
          border: "1px var(--custom-success-border) solid",
          color: "var(--custom-toast-text)",
          backdropFilter: "blur(120px)",
          WebkitBackdropFilter: "blur(120px)",
        },
      });

      return m_data.data;
    } catch (error) {
      const axiosError = error as AxiosError<CustomResponse>;

      if (!axiosError.response) {
        console.error(error);
        throw axiosError;
      }

      toast.error(axiosError.response.data.title || "Error", {
        description: axiosError.response.data.message || "Something went wrong",
        style: {
          background: "oklch(--custom-error)",
        },
      });

      return null;
    }
  },
  post: async function <T, U>(
    url: string,
    data: T,
    config?: AxiosRequestConfig
  ): Promise<U | null> {
    const token = await getCookie();

    let m_urlParams;

    if (config?.params) m_urlParams = qs.stringify(config.params);

    try {
      const m_data = await axios.post<U & CustomResponse>(
        `${ENV.BASEURL}${url}`,
        data,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token ? token : null}`,
          },
          params: m_urlParams || null,
          signal: AbortSignal.timeout(5000),
          timeoutErrorMessage: "Request Timed out",
          ...config,
        }
      );

      const isSuccess = m_data.data.success;

      toast(m_data.data.title || "Success", {
        description: m_data.data.message || "Welcome",
        duration: 3400,
        style: {
          background: isSuccess
            ? "var(--custom-success)"
            : "var(--custom-error)",
          border: isSuccess
            ? "1px var(--custom-success-border) solid"
            : "1px var(--custom-error-border) solid",
          color: "var(--custom-toast-text)",
          backdropFilter: "blur(120px)",
          WebkitBackdropFilter: "blur(120px)",
        },
      });

      return m_data.data;
    } catch (error) {
      const axiosError = error as AxiosError<CustomResponse>;

      if (!axiosError.response) {
        console.error(error);
        throw axiosError;
      }
      toast(axiosError.response.data.title || "Error", {
        description: axiosError.response.data.message || "Something went wrong",
        duration: 3400,
        style: {
          background: "var(--custom-error)",
          border: "1px var(--custom-error-border) solid",
          color: "var(--custom-toast-text)",
          backdropFilter: "blur(120px)",
          WebkitBackdropFilter: "blur(120px)",
        },
      });

      return null;
    }
  },
  put: async function <T, U>(
    url: string,
    data: T,
    config?: AxiosRequestConfig
  ): Promise<U | null> {
    const token = await getCookie();

    let m_urlParams;

    if (config?.params) m_urlParams = qs.stringify(config.params);

    try {
      const m_data = await axios.put<U & CustomResponse>(
        `${ENV.BASEURL}${url}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token ? token : null}`,
          },
          params: m_urlParams || null,
          signal: AbortSignal.timeout(5000),
          timeoutErrorMessage: "Request Timed out",
          ...config,
        }
      );

      const isSuccess = m_data.data.success;

      toast(m_data.data.title || "Success", {
        description: m_data.data.message || "Welcome",
        duration: 3400,
        style: {
          background: isSuccess
            ? "var(--custom-success)"
            : "var(--custom-error)",
          border: isSuccess
            ? "1px var(--custom-success-border) solid"
            : "1px var(--custom-error-border) solid",
          color: "var(--custom-toast-text)",
          backdropFilter: "blur(120px)",
          WebkitBackdropFilter: "blur(120px)",
        },
      });

      return m_data.data;
    } catch (error) {
      const axiosError = error as AxiosError<CustomResponse>;

      if (!axiosError.response) {
        console.error(error);
        throw axiosError;
      }
      toast(axiosError.response.data.title || "Error", {
        description: axiosError.response.data.message || "Something went wrong",
        duration: 3400,
        style: {
          background: "var(--custom-error)",
          border: "1px var(--custom-error-border) solid",
          color: "var(--custom-toast-text)",
          backdropFilter: "blur(120px)",
          WebkitBackdropFilter: "blur(120px)",
        },
      });

      return null;
    }
  },
  delete: async function <T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<T | null> {
    const token = await getCookie();

    let m_urlParams;

    if (config?.params) m_urlParams = qs.stringify(config.params);

    try {
      const m_data = await axios.delete(`${ENV.BASEURL}${url}`, {
        headers: {
          Authorization: `Bearer ${token ? token : null}`,
        },
        params: m_urlParams || null,
        signal: AbortSignal.timeout(5000),
        timeoutErrorMessage: "Request Timed out",
        ...config,
      });

      toast(m_data.data.title || "Success", {
        description: m_data.data.message || "Welcome",
        duration: 3400,
        style: {
          background: "var(--custom-success)",
          border: "1px var(--custom-success-border) solid",
          color: "var(--custom-toast-text)",
          backdropFilter: "blur(120px)",
          WebkitBackdropFilter: "blur(120px)",
        },
      });

      return m_data.data;
    } catch (error) {
      const axiosError = error as AxiosError<CustomResponse>;

      if (!axiosError.response) {
        console.error(error);
        throw axiosError;
      }

      toast(axiosError.response.data.title || "Error", {
        description: axiosError.response.data.message || "Something went wrong",
        style: {
          background: "oklch(--custom-error)",
          backdropFilter: "blur(120px)",
          WebkitBackdropFilter: "blur(120px)",
        },
      });

      return null;
    }
  },
};
