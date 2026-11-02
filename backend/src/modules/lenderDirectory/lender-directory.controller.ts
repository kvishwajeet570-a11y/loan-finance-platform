import type { Request, Response } from "express";
import prisma from "../../prisma/prisma";

type ServiceabilityRow = {
  name: string;
  records: number;
  productRecords: number;
  products: string[];
};

export async function getLenderDirectory(_req: Request, res: Response) {
  try {
    const [serviceRows, policies] = await Promise.all([
      prisma.$queryRaw<ServiceabilityRow[]>`
        SELECT
          "lenderName" AS name,
          COUNT(*)::int AS records,
          COUNT(*) FILTER (
            WHERE "productType" IS NOT NULL
              AND BTRIM("productType") <> ''
          )::int AS "productRecords",
          COALESCE(
            ARRAY_AGG(DISTINCT BTRIM("productType"))
              FILTER (
                WHERE "productType" IS NOT NULL
                  AND BTRIM("productType") <> ''
              ),
            ARRAY[]::text[]
          ) AS products
        FROM "pincode_serviceability"
        WHERE "lenderName" IS NOT NULL
          AND BTRIM("lenderName") <> ''
        GROUP BY "lenderName"
        ORDER BY "lenderName"
      `,
      prisma.lenderPolicy.findMany({
        where: { isActive: true },
        select: {
          lenderName: true,
          productName: true,
          loanType: true,
        },
        orderBy: [{ lenderName: "asc" }, { productName: "asc" }],
      }),
    ]);

    const directory = new Map<string, {
      name: string;
      records: number;
      productRecords: number;
      products: Set<string>;
      policyRecords: number;
    }>();

    for (const row of serviceRows) {
      const name = String(row.name ?? "").trim();
      if (!name) continue;

      const key = name.toLocaleLowerCase();
      directory.set(key, {
        name,
        records: Number(row.records) || 0,
        productRecords: Number(row.productRecords) || 0,
        products: new Set(
          (row.products ?? []).map((p) => String(p).trim()).filter(Boolean)
        ),
        policyRecords: 0,
      });
    }

    for (const policy of policies) {
      const name = policy.lenderName.trim();
      if (!name) continue;

      const key = name.toLocaleLowerCase();
      let item = directory.get(key);

      if (!item) {
        item = {
          name,
          records: 0,
          productRecords: 0,
          products: new Set<string>(),
          policyRecords: 0,
        };
        directory.set(key, item);
      }

      if (policy.productName?.trim()) {
        item.products.add(policy.productName.trim());
      }
      if (policy.loanType?.trim()) {
        item.products.add(policy.loanType.trim());
      }

      item.policyRecords += 1;
    }

    const data = Array.from(directory.values())
      .map((item) => ({
        name: item.name,
        records: item.records,
        products: Array.from(item.products).sort((a, b) =>
          a.localeCompare(b)
        ),
        productRecords: item.productRecords + item.policyRecords,
        dataType: item.records > 0
          ? (item.policyRecords > 0
              ? "Serviceability + Policy"
              : "Serviceability")
          : "Policy",
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const totalRecords = data.reduce(
      (sum, item) => sum + item.records,
      0
    );

    return res.json({ success: true, totalRecords, data });
  } catch (error) {
    console.error("Failed to load lender directory:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load lender directory.",
    });
  }
}
