import prisma from "../../prisma/prisma";

interface CategoryFilterDto {
  page?: number;
  limit?: number;
  search?: string;
}

interface CreateCategoryDto {
  name: string;
  slug: string;
  description?: string;
}

class BlogCategoryService {
  async getCategories(filters: CategoryFilterDto) {
    const {
      page = 1,
      limit = 10,
      search,
    } = filters;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          slug: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    const [categories, total] = await Promise.all([
      prisma.blogCategory.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.blogCategory.count({ where }),
    ]);

    return {
      categories,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async getCategoryById(id: string) {
    return prisma.blogCategory.findUnique({
      where: { id },
    });
  }

  async createCategory(data: CreateCategoryDto) {
    const existing =
      await prisma.blogCategory.findUnique({
        where: {
          slug: data.slug,
        },
      });

    if (existing) {
      throw new Error(
        "Category slug already exists"
      );
    }

    return prisma.blogCategory.create({
      data,
    });
  }

  async updateCategory(
    id: string,
    data: Partial<CreateCategoryDto>
  ) {
    return prisma.blogCategory.update({
      where: { id },
      data,
    });
  }

  async toggleStatus(id: string) {
    const category =
      await prisma.blogCategory.findUnique({
        where: { id },
      });

    if (!category) {
      throw new Error("Category not found");
    }

    return prisma.blogCategory.update({
      where: { id },
      data: {
        isActive: !category.isActive,
      },
    });
  }

  async softDelete(id: string) {
    return prisma.blogCategory.delete({
      where: { id },
    });
  }

  async getAnalytics() {
    const [total, active, inactive] =
      await Promise.all([
        prisma.blogCategory.count(),
        prisma.blogCategory.count({
          where: {
            isActive: true,
          },
        }),
        prisma.blogCategory.count({
          where: {
            isActive: false,
          },
        }),
      ]);

    return {
      total,
      active,
      inactive,
    };
  }
}

export default new BlogCategoryService();