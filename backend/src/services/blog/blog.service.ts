import { BlogRepository } from "../../repositories/blog/blog.repository";

export class BlogService {
  // ========================================
  // CREATE BLOG
  // ========================================

  async createBlog(data: {
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    featuredImage?: string;
    category?: string;
    tags?: string[];
    metaTitle?: string;
    metaDescription?: string;
    isPublished?: boolean;
    publishedAt?: Date;
  }) {
    return BlogRepository.createBlog(data);
  }

  // ========================================
  // GET BLOG BY ID
  // ========================================

  async getBlogById(blogId: string) {
    return BlogRepository.getBlogById(blogId);
  }

  // ========================================
  // GET BLOG BY SLUG
  // ========================================

  async getBlogBySlug(slug: string) {
    return BlogRepository.getBlogBySlug(slug);
  }

  // ========================================
  // GET ALL BLOGS
  // ========================================

  async getAllBlogs(
    page: number = 1,
    limit: number = 10
  ) {
    return BlogRepository.getAllBlogs(page, limit);
  }

  // ========================================
  // GET PUBLISHED BLOGS
  // ========================================

  async getPublishedBlogs(
    page: number = 1,
    limit: number = 10
  ) {
    return BlogRepository.getPublishedBlogs(page, limit);
  }

  // ========================================
  // GET BLOGS BY CATEGORY
  // ========================================

  async getBlogsByCategory(
    category: string,
    page: number = 1,
    limit: number = 10
  ) {
    return BlogRepository.getBlogsByCategory(
      category,
      page,
      limit
    );
  }

  // ========================================
  // SEARCH BLOGS
  // ========================================

  async searchBlogs(
    search: string,
    page: number = 1,
    limit: number = 10
  ) {
    return BlogRepository.searchBlogs(
      search,
      page,
      limit
    );
  }

  // ========================================
  // UPDATE BLOG
  // ========================================

  async updateBlog(
    blogId: string,
    data: {
      title?: string;
      slug?: string;
      excerpt?: string;
      content?: string;
      featuredImage?: string;
      category?: string;
      tags?: string[];
      metaTitle?: string;
      metaDescription?: string;
      isPublished?: boolean;
      publishedAt?: Date | null;
    }
  ) {
    return BlogRepository.updateBlog(
      blogId,
      data
    );
  }

  // ========================================
  // PUBLISH BLOG
  // ========================================

  async publishBlog(blogId: string) {
    return BlogRepository.publishBlog(blogId);
  }

  // ========================================
  // UNPUBLISH BLOG
  // ========================================

  async unpublishBlog(blogId: string) {
    return BlogRepository.unpublishBlog(blogId);
  }
    // ========================================
  // INCREMENT BLOG VIEW
  // ========================================

  async incrementView(blogId: string) {
    return BlogRepository.incrementView(blogId);
  }

  // ========================================
  // DELETE BLOG
  // ========================================

  async deleteBlog(blogId: string) {
    return BlogRepository.deleteBlog(blogId);
  }

  // ========================================
  // BLOG ANALYTICS
  // ========================================

  async getBlogAnalytics() {
    return BlogRepository.getBlogAnalytics();
  }
}

export default new BlogService();