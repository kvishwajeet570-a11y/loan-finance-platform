import { Request, Response } from "express";
import blogCategoryService from "../../services/blog-category/blogCategory.service";

export const getCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = String(req.query.search || "");

    const result = await blogCategoryService.getCategories({
      page,
      limit,
      search,
    });

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};

export const getCategoryById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const category = await blogCategoryService.getCategoryById(
      req.params.id
    );

    if (!category) {
      res.status(404).json({
        success: false,
        message: "Category not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch category",
    });
  }
};

export const createCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const category = await blogCategoryService.createCategory(
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const category = await blogCategoryService.updateCategory(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const toggleCategoryStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const category =
      await blogCategoryService.toggleStatus(
        req.params.id
      );

    res.status(200).json({
      success: true,
      message: "Status updated",
      data: category,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to update status",
    });
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await blogCategoryService.softDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to delete category",
    });
  }
};

export const getCategoryAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const analytics =
      await blogCategoryService.getAnalytics();

    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
    });
  }
};