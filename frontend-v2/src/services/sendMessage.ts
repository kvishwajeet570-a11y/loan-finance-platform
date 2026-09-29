import api from "@/lib/api";

export interface SendMessagePayload {
  title: string;
  message: string;
  type: string;
  userId: string;
}

export interface SendMessageResponse {
  success: boolean;
  message?: string;
  notification?: unknown;
}

export async function sendMessage(
  payload: SendMessagePayload
): Promise<SendMessageResponse> {
  const response = await api.post(
    "/notification/send-sms",
    payload
  );

  return response.data;
}
