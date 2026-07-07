import { Request, Response } from "express";
import blogService from "../../services/blog/blog.service";

export const getBlogs = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);

    const blogs = await blogService.getBlogs(
      page,
      limit
    );

    res.status(200).json({
      success: true,
      ...blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch blogs",
    });
  }
};

export const getBlogBySlug = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const blog = await blogService.getBlogBySlug(
      req.params.slug
    );

    if (!blog) {
      res.status(404).json({
        success: false,
        message: "Blog not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch blog",
    });
  }
};

export const createBlog = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const blog = await blogService.createBlog(
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create blog",
    });
  }
};

export const updateBlog = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const blog = await blogService.updateBlog(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update blog",
    });
  }
};

export const deleteBlog = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await blogService.deleteBlog(req.params.id);

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete blog",
    });
  }
};

export const getBlogAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const analytics =
      await blogService.getBlogAnalytics();

    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
    });
  }
};