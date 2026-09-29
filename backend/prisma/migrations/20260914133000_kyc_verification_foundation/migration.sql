ALTER TABLE "KYC"
ADD COLUMN "panVerificationStatus" TEXT NOT NULL DEFAULT 'PENDING',
ADD COLUMN "aadhaarVerificationStatus" TEXT NOT NULL DEFAULT 'PENDING',
ADD COLUMN "bankVerificationStatus" TEXT NOT NULL DEFAULT 'PENDING',
ADD COLUMN "panVerifiedAt" TIMESTAMP(3),
ADD COLUMN "aadhaarVerifiedAt" TIMESTAMP(3),
ADD COLUMN "bankVerifiedAt" TIMESTAMP(3),
ADD COLUMN "verificationUpdatedAt" TIMESTAMP(3);

CREATE TABLE "KYCVerification" (
    "id" TEXT NOT NULL,
    "kycId" TEXT NOT NULL,
    "verificationType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "provider" TEXT,
    "referenceId" TEXT,
    "message" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KYCVerification_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "KYCVerification_kycId_idx" ON "KYCVerification"("kycId");
CREATE INDEX "KYCVerification_verificationType_idx" ON "KYCVerification"("verificationType");
CREATE INDEX "KYCVerification_status_idx" ON "KYCVerification"("status");
CREATE INDEX "KYCVerification_createdAt_idx" ON "KYCVerification"("createdAt");

ALTER TABLE "KYCVerification"
ADD CONSTRAINT "KYCVerification_kycId_fkey"
FOREIGN KEY ("kycId") REFERENCES "KYC"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
