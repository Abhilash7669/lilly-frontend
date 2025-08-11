import { AXIOS_CLIENT } from "@/lib/api/client/axios.client";
import { ENV } from "@/lib/config/env.config";
import {
  LoginFormData,
  LoginResponse,
  OAuthResponse,
  SignUpFormData,
  SignUpResponse,
} from "@/types/auth/auth.types";
import axios, { AxiosError } from "axios";

export const authServices = {
  login: async function Login(
    m_data: LoginFormData
  ): Promise<LoginResponse | null> {
    const response = await AXIOS_CLIENT.post<LoginFormData, LoginResponse>(
      "/auth/login",
      m_data,
      {
        headers: {
          "Content-type": "application/json",
        },
      }
    );

    if (!response) return null;

    if (!response.success) return null;

    return response;
  },
  oAuth: async function OAuth(): Promise<OAuthResponse> {
    try {
      const response = await axios.get<OAuthResponse>(`${ENV.BASE_ENDPOINT}/`);

      return response.data;
    } catch (error) {
      throw error as AxiosError;
    }
  },
  signUp: async function SignUp(m_data: SignUpFormData): Promise<SignUpResponse | null> {
    const response = await AXIOS_CLIENT.post<SignUpFormData, SignUpResponse>(
      "/auth/sign-up",
      m_data,
      {
        headers: {
          "Content-type": "application/json",
        },
      }
    );
    return response;
  },
};
