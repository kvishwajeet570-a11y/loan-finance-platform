"use strict";
// src/helpers/pagination.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaginationMeta = exports.getPagination = void 0;
const getPagination = (params) => {
    const page = Math.max(Number(params.page) || 1, 1);
    const limit = Math.max(Number(params.limit) || 10, 1);
    const skip = (page - 1) * limit;
    return {
        page,
        limit,
        skip,
    };
};
exports.getPagination = getPagination;
const getPaginationMeta = (total, page, limit) => {
    return {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
    };
};
exports.getPaginationMeta = getPaginationMeta;
