import api from "@/lib/api";
import type { CMSPage } from "@/types/home";

export async function getPublishedPages(): Promise<CMSPage[]> {
  const response = await api.get("/cms/published");
  const body = response.data;

  if (!body?.success) {
    throw new Error(body?.message || "Failed to load CMS pages");
  }

  return Array.isArray(body.data) ? body.data : [];
}

export async function getPageBySlug(
  slug: string
): Promise<CMSPage | null> {
  const response = await api.get(
    `/cms/slug/${encodeURIComponent(slug)}`
  );

  const body = response.data;

  if (!body?.success) {
    return null;
  }

  return body.data ?? null;
}
