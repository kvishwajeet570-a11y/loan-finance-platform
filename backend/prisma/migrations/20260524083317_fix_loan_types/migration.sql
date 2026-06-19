/*
  Warnings:

  - Changed the type of `amount` on the `LoanApplication` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `income` on the `LoanApplication` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "LoanApplication" DROP COLUMN "amount",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL,
DROP COLUMN "income",
ADD COLUMN     "income" DOUBLE PRECISION NOT NULL;
