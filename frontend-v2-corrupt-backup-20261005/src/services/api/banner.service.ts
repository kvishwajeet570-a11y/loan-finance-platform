import api from "@/lib/api";
import type { Banner } from "@/types/home";

export async function getActiveBanners(): Promise<Banner[]> {
  const response = await api.get("/banner/active");
  const body = response.data;

  if (!body?.success) {
    throw new Error(body?.message || "Failed to load banners");
  }

  if (Array.isArray(body.data)) return body.data;
  if (Array.isArray(body.banners)) return body.banners;

  return [];
}
