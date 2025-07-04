export type BasicResponse<T> = {
  success: boolean;
  title: string;
  message: string;
  status_code?: number;
  data?: T;
} & Record<string, unknown>;