import { body } from "express-validator";

export const createCategoryValidation = [
  body("name")
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage(
      "Category name must be between 2 and 100 characters"
    ),

  body("slug")
    .notEmpty()
    .withMessage("Slug is required")
    .matches(/^[a-z0-9-]+$/)
    .withMessage(
      "Slug can only contain lowercase letters, numbers and hyphens"
    ),

  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage(
      "Description cannot exceed 500 characters"
    ),
];

export const updateCategoryValidation = [
  body("name")
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage(
      "Category name must be between 2 and 100 characters"
    ),

  body("slug")
    .optional()
    .matches(/^[a-z0-9-]+$/)
    .withMessage(
      "Slug can only contain lowercase letters, numbers and hyphens"
    ),

  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage(
      "Description cannot exceed 500 characters"
    ),
];