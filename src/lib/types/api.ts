export type BasicResponse = {
  success: boolean;
  title: string;
  message: string;
  status_code?: number;
  data?: Record<string, unknown>;
} & Record<string, unknown>;