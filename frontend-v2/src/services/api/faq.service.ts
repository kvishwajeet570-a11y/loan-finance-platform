import api from "@/lib/api";
import type { FAQ } from "@/types/home";

export interface FAQResponse {
  success: boolean;
  faqs: FAQ[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export async function getPublishedFaqs(
  page = 1,
  limit = 10
): Promise<FAQResponse> {
  const response = await api.get("/faq/published", {
    params: {
      page,
      limit,
    },
  });

  const body = response.data;

  if (!body?.success) {
    throw new Error(body?.message || "Failed to load FAQs");
  }

  const faqs = Array.isArray(body.data)
    ? body.data
    : Array.isArray(body.faqs)
      ? body.faqs
      : [];

  return {
    success: true,
    faqs,
    total: body.total,
    page: body.page,
    limit: body.limit,
    totalPages: body.totalPages,
  };
}
