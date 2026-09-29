"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategoryValidation = exports.createCategoryValidation = void 0;
const express_validator_1 = require("express-validator");
exports.createCategoryValidation = [
    (0, express_validator_1.body)("name")
        .notEmpty()
        .withMessage("Category name is required")
        .isLength({ min: 2, max: 100 })
        .withMessage("Category name must be between 2 and 100 characters"),
    (0, express_validator_1.body)("slug")
        .notEmpty()
        .withMessage("Slug is required")
        .matches(/^[a-z0-9-]+$/)
        .withMessage("Slug can only contain lowercase letters, numbers and hyphens"),
    (0, express_validator_1.body)("description")
        .optional()
        .isLength({ max: 500 })
        .withMessage("Description cannot exceed 500 characters"),
];
exports.updateCategoryValidation = [
    (0, express_validator_1.body)("name")
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage("Category name must be between 2 and 100 characters"),
    (0, express_validator_1.body)("slug")
        .optional()
        .matches(/^[a-z0-9-]+$/)
        .withMessage("Slug can only contain lowercase letters, numbers and hyphens"),
    (0, express_validator_1.body)("description")
        .optional()
        .isLength({ max: 500 })
        .withMessage("Description cannot exceed 500 characters"),
];
