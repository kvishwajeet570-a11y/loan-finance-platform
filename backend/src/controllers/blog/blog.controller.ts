import { Request, Response } from "express";
import BlogService from "../../services/blog/blog.service";

export class BlogController {
  // ========================================
  // CREATE BLOG
  // ========================================

  static async createBlog(req: Request, res: Response) {
    try {
      const blog = await BlogService.createBlog(req.body);

      return res.status(201).json({
        success: true,
        message: "Blog created successfully.",
        data: blog,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to create blog.",
      });
    }
  }

  // ========================================
  // GET BLOG BY ID
  // ========================================

  static async getBlogById(req: Request, res: Response) {
    try {
      const id = req.params.id as string;

      const blog = await BlogService.getBlogById(id);

      if (!blog) {
        return res.status(404).json({
          success: false,
          message: "Blog not found.",
        });
      }

      return res.status(200).json({
        success: true,
        data: blog,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch blog.",
      });
    }
  }

  // ========================================
  // GET BLOG BY SLUG
  // ========================================

  static async getBlogBySlug(req: Request, res: Response) {
    try {
      const slug = req.params.slug as string;

      const blog = await BlogService.getBlogBySlug(slug);

      if (!blog) {
        return res.status(404).json({
          success: false,
          message: "Blog not found.",
        });
      }

      return res.status(200).json({
        success: true,
        data: blog,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch blog.",
      });
    }
  }
// ========================================
// GET ALL BLOGS
// ========================================

static async getAllBlogs(req: Request, res: Response) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await BlogService.getAllBlogs(page, limit);

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch blogs.",
    });
  }
}

// ========================================
// GET PUBLISHED BLOGS
// ========================================

static async getPublishedBlogs(req: Request, res: Response) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await BlogService.getPublishedBlogs(
      page,
      limit
    );

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch published blogs.",
    });
  }
}

 // ========================================
// GET BLOGS BY CATEGORY
// ========================================

static async getBlogsByCategory(req: Request, res: Response) {
  try {
    const category = req.params.category as string;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const blogs = await BlogService.getBlogsByCategory(
      category,
      page,
      limit
    );

    return res.status(200).json(blogs);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch category blogs.",
    });
  }
}

// ========================================
// SEARCH BLOGS
// ========================================

static async searchBlogs(req: Request, res: Response) {
  try {
    const search = String(req.query.search || "");
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await BlogService.searchBlogs(
      search,
      page,
      limit
    );

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to search blogs.",
    });
  }
}
    // ========================================
  // UPDATE BLOG
  // ========================================

  static async updateBlog(req: Request, res: Response) {
    try {
      const id = req.params.id as string;

      const blog = await BlogService.updateBlog(
        id,
        req.body
      );

      return res.status(200).json({
        success: true,
        message: "Blog updated successfully.",
        data: blog,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to update blog.",
      });
    }
  }

  // ========================================
  // PUBLISH BLOG
  // ========================================

  static async publishBlog(req: Request, res: Response) {
    try {
      const id = req.params.id as string;

      const blog = await BlogService.publishBlog(id);

      return res.status(200).json({
        success: true,
        message: "Blog published successfully.",
        data: blog,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to publish blog.",
      });
    }
  }

  // ========================================
  // UNPUBLISH BLOG
  // ========================================

  static async unpublishBlog(req: Request, res: Response) {
    try {
      const id = req.params.id as string;

      const blog = await BlogService.unpublishBlog(id);

      return res.status(200).json({
        success: true,
        message: "Blog unpublished successfully.",
        data: blog,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to unpublish blog.",
      });
    }
  }
    // ========================================
  // INCREMENT BLOG VIEW
  // ========================================

  static async incrementView(req: Request, res: Response) {
    try {
      const id = req.params.id as string;

      const blog = await BlogService.incrementView(id);

      return res.status(200).json({
        success: true,
        message: "Blog view updated successfully.",
        data: blog,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to update blog views.",
      });
    }
  }

  // ========================================
  // DELETE BLOG
  // ========================================

  static async deleteBlog(req: Request, res: Response) {
    try {
      const id = req.params.id as string;

      await BlogService.deleteBlog(id);

      return res.status(200).json({
        success: true,
        message: "Blog deleted successfully.",
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to delete blog.",
      });
    }
  }

  // ========================================
  // BLOG ANALYTICS
  // ========================================

  static async getBlogAnalytics(req: Request, res: Response) {
    try {
      const analytics = await BlogService.getBlogAnalytics();

      return res.status(200).json({
        success: true,
        data: analytics,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch blog analytics.",
      });
    }
  }
}

export default BlogController;