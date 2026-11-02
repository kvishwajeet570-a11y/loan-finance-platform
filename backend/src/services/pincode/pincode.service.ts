import prisma from "../../prisma/prisma";

class PincodeService {
  async search(query: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where = {
      isActive: true,
      OR: [
        { pincode: { contains: query } },
        { postOfficeName: { contains: query, mode: "insensitive" as const } },
        { district: { contains: query, mode: "insensitive" as const } },
        { state: { contains: query, mode: "insensitive" as const } },
      ],
    };

    const [data, total] = await Promise.all([
      prisma.pincode.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ state: "asc" }, { district: "asc" }, { postOfficeName: "asc" }],
      }),
      prisma.pincode.count({ where }),
    ]);

    return { data, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async getByPincode(pincode: string) {
    const locations = await prisma.pincode.findMany({
      where: { pincode, isActive: true },
      orderBy: { postOfficeName: "asc" },
    });

    if (locations.length === 0) return [];

    const serviceability = await prisma.$queryRaw<Array<{
      lenderName: string;
      productType: string | null;
      status: string | null;
      sourceSheet: string;
      branchName: string | null;
      branchAddress: string | null;
    }>>`
      SELECT "lenderName", "productType", "status", "sourceSheet",
             "branchName", "branchAddress"
      FROM "pincode_serviceability"
      WHERE "pincode" = ${pincode}
      ORDER BY "lenderName", "productType"
    `;

    return locations.map((location) => ({
      ...location,
      serviceability,
      serviceabilityCount: serviceability.length,
    }));
  }
}

export default new PincodeService();

