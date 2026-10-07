import { useQuery } from "@tanstack/react-query";
import { getActiveBanners } from "@/services/api/banner.service";
import { getPublishedPages } from "@/services/api/cms.service";
import { getPublishedFaqs } from "@/services/api/faq.service";
import { getPublishedBlogs } from "@/services/api/blog.service";

export function useHomeBanners() {
  return useQuery({
    queryKey: ["home", "banners"],
    queryFn: getActiveBanners,
  });
}

export function useHomePages() {
  return useQuery({
    queryKey: ["home", "pages"],
    queryFn: getPublishedPages,
  });
}

export function useHomeFaqs() {
  return useQuery({
    queryKey: ["home", "faqs"],
    queryFn: () => getPublishedFaqs(1, 10),
  });
}

export function useHomeBlogs() {
  return useQuery({
    queryKey: ["home", "blogs"],
    queryFn: () => getPublishedBlogs(1, 6),
  });
}
