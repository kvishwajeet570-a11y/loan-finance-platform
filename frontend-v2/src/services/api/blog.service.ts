import api from "@/lib/api";
import type { BlogPost } from "@/types/home";

export interface BlogResponse {
  success: boolean;
  blogs: BlogPost[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export async function getPublishedBlogs(
  page = 1,
  limit = 6
): Promise<BlogResponse> {
  const response = await api.get("/blog/published", {
    params: {
      page,
      limit,
    },
  });

  const body = response.data;

  if (!body?.success) {
    throw new Error(body?.message || "Failed to load blogs");
  }

  const blogs = Array.isArray(body.data)
    ? body.data
    : Array.isArray(body.blogs)
      ? body.blogs
      : [];

  return {
    success: true,
    blogs,
    total: body.total,
    page: body.page,
    limit: body.limit,
    totalPages: body.totalPages,
  };
}
