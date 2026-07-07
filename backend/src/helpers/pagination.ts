// src/helpers/pagination.ts

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationResult {
  page: number;
  limit: number;
  skip: number;
}

export const getPagination = (
  params: PaginationParams
): PaginationResult => {
  const page = Math.max(
    Number(params.page) || 1,
    1
  );

  const limit = Math.max(
    Number(params.limit) || 10,
    1
  );

  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
  };
};

export const getPaginationMeta = (
  total: number,
  page: number,
  limit: number
) => {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(
      total / limit
    ),
    hasNextPage:
      page < Math.ceil(total / limit),
    hasPreviousPage: page > 1,
  };
};