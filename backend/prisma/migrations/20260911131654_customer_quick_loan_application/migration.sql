/*
  Warnings:

  - You are about to drop the column `documentUrl` on the `LoanApplication` table. All the data in the column will be lost.
  - You are about to drop the column `income` on the `LoanApplication` table. All the data in the column will be lost.
  - The `status` column on the `LoanApplication` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[referralCode]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ReferralStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'REWARDED', 'PAID', 'EXPIRED', 'FRAUD', 'CANCELLED');

-- CreateEnum
CREATE TYPE "RoleCategory" AS ENUM ('ADMIN', 'CUSTOMER', 'DSA', 'PARTNER', 'STAFF');

-- CreateEnum
CREATE TYPE "LoanStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'DISBURSED');

-- CreateEnum
CREATE TYPE "AuditSeverity" AS ENUM ('INFO', 'WARNING', 'ERROR', 'CRITICAL');

-- CreateEnum
CREATE TYPE "InvestmentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'ACTIVE', 'CLOSED');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('LOW', 'MODERATE', 'HIGH');

-- CreateEnum
CREATE TYPE "RechargeStatus" AS ENUM ('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'REFUNDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "RechargeType" AS ENUM ('MOBILE', 'DTH', 'FASTAG', 'ELECTRICITY', 'GAS', 'WATER');

-- CreateEnum
CREATE TYPE "SystemSettingCategory" AS ENUM ('SYSTEM', 'APPLICATION', 'SECURITY', 'AUTH', 'DATABASE', 'API', 'LOAN_ENGINE', 'COMMISSION_ENGINE', 'PAYMENT', 'NOTIFICATION', 'AUDIT', 'FEATURE_FLAG', 'ENVIRONMENT');

-- CreateEnum
CREATE TYPE "SystemSettingDataType" AS ENUM ('STRING', 'NUMBER', 'BOOLEAN', 'JSON', 'ARRAY');

-- AlterTable
ALTER TABLE "LoanApplication" DROP COLUMN "documentUrl",
DROP COLUMN "income",
ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedBy" TEXT,
ADD COLUMN     "assignedTo" TEXT,
ADD COLUMN     "dob" TEXT,
ADD COLUMN     "employmentType" TEXT,
ADD COLUMN     "monthlyIncome" DOUBLE PRECISION,
ADD COLUMN     "partnerId" TEXT,
ADD COLUMN     "rejectionReason" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "LoanStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "aadharCardImage" TEXT,
ADD COLUMN     "accountLockedUntil" TIMESTAMP(3),
ADD COLUMN     "address" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "dob" TEXT,
ADD COLUMN     "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastLogin" TIMESTAMP(3),
ADD COLUMN     "lastLoginDevice" TEXT,
ADD COLUMN     "lastLoginIp" TEXT,
ADD COLUMN     "lastSeen" TIMESTAMP(3),
ADD COLUMN     "loginCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "panCardImage" TEXT,
ADD COLUMN     "passwordChangedAt" TIMESTAMP(3),
ADD COLUMN     "pincode" TEXT,
ADD COLUMN     "referralCode" TEXT,
ADD COLUMN     "refreshToken" TEXT,
ADD COLUMN     "roleId" TEXT,
ADD COLUMN     "selfieImage" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedBy" TEXT;

-- CreateTable
CREATE TABLE "fAQ" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "category" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "views" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "fAQ_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fastTag" (
    "id" TEXT NOT NULL,
    "vehicleNo" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'success',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "slug" TEXT,

    CONSTRAINT "fastTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insurance" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "minAmount" DOUBLE PRECISION NOT NULL,
    "premiumCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "coverageAmount" DOUBLE PRECISION,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "maxAmount" DOUBLE PRECISION,
    "policyNumber" TEXT NOT NULL,
    "premiumRate" DOUBLE PRECISION,
    "tenureMonths" INTEGER,

    CONSTRAINT "insurance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "reward" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Commission" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL,
    "loanId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "commissionAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "partnerId" TEXT,
    "source" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "approvedAt" TIMESTAMP(3),
    "loanAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rejectionReason" TEXT,

    CONSTRAINT "Commission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cashback" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rewardBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalEarnings" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,
    "isFrozen" BOOLEAN NOT NULL DEFAULT false,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "referenceId" TEXT,
    "gatewayTxnId" TEXT,
    "orderId" TEXT,
    "userId" TEXT,
    "customerId" TEXT,
    "dsaId" TEXT,
    "partnerId" TEXT,
    "walletId" TEXT,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "paymentMethod" TEXT,
    "paymentGateway" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "fee" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "gst" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "commission" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cashback" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tax" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "netAmount" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "loanId" TEXT,
    "rechargeId" TEXT,
    "insuranceId" TEXT,
    "investmentId" TEXT,
    "referralId" TEXT,
    "commissionId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "isRefunded" BOOLEAN NOT NULL DEFAULT false,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "rejectedBy" TEXT,
    "rejectedAt" TIMESTAMP(3),
    "rejectReason" TEXT,
    "verifiedBy" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "refundAmount" DOUBLE PRECISION,
    "refundReason" TEXT,
    "refundedBy" TEXT,
    "refundedAt" TIMESTAMP(3),
    "description" TEXT,
    "remark" TEXT,
    "notes" TEXT,
    "ipAddress" TEXT,
    "deviceInfo" TEXT,
    "platform" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coupon" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL,
    "minAmount" DOUBLE PRECISION,
    "maxDiscount" DOUBLE PRECISION,
    "maxUsage" INTEGER NOT NULL DEFAULT 100,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "referrals" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "referralCode" TEXT NOT NULL,
    "referralLink" TEXT,
    "status" "ReferralStatus" NOT NULL DEFAULT 'PENDING',
    "totalReferrals" INTEGER NOT NULL DEFAULT 0,
    "successfulReferrals" INTEGER NOT NULL DEFAULT 0,
    "pendingReferrals" INTEGER NOT NULL DEFAULT 0,
    "rejectedReferrals" INTEGER NOT NULL DEFAULT 0,
    "rewardAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rewardPaidAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalEarnings" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "rewardTransactionId" TEXT,
    "referrerId" TEXT,
    "referredUserId" TEXT,
    "source" TEXT,
    "campaign" TEXT,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "rejectedBy" TEXT,
    "rejectedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "paidAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "isFraud" BOOLEAN NOT NULL DEFAULT false,
    "fraudReason" TEXT,
    "ipAddress" TEXT,
    "deviceInfo" TEXT,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "referrals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recharge" (
    "id" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "operator" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "planDetails" TEXT,
    "transactionRef" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "failureReason" TEXT,
    "operatorTxnId" TEXT,
    "completedAt" TIMESTAMP(3),
    "serviceType" TEXT,
    "commissionAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "deviceInfo" TEXT,
    "ipAddress" TEXT,
    "processedAt" TIMESTAMP(3),
    "refundedAt" TIMESTAMP(3),
    "refundedBy" TEXT,
    "remarks" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "rechargeType" "RechargeType" NOT NULL,
    "status" "RechargeStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Recharge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT DEFAULT 'general',
    "userId" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP(3),
    "archivedAt" TIMESTAMP(3),
    "channel" TEXT DEFAULT 'app',
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "priority" TEXT DEFAULT 'medium',

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportTicket" (
    "id" TEXT NOT NULL,
    "ticketNumber" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "status" TEXT NOT NULL DEFAULT 'open',
    "adminReply" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedTo" TEXT,
    "description" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "category" TEXT,

    CONSTRAINT "SupportTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EMIPayment" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentMethod" TEXT,
    "status" TEXT NOT NULL DEFAULT 'paid',
    "loanId" TEXT NOT NULL,

    CONSTRAINT "EMIPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FastagRecharge" (
    "id" TEXT NOT NULL,
    "vehicleNo" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'success',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FastagRecharge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ElectricityBill" (
    "id" TEXT NOT NULL,
    "consumerNo" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'paid',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ElectricityBill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobApplication" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "position" TEXT,
    "resumeUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RevenueAnalytics" (
    "id" TEXT NOT NULL,
    "totalRevenue" DOUBLE PRECISION NOT NULL,
    "totalUsers" INTEGER NOT NULL,
    "totalLoans" INTEGER NOT NULL,
    "totalTransactions" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RevenueAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Leaderboard" (
    "id" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    "totalSales" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Leaderboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserActivity" (
    "id" TEXT NOT NULL,
    "activity" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SecurityLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "severity" TEXT DEFAULT 'LOW',
    "status" TEXT DEFAULT 'SUCCESS',
    "module" TEXT,
    "description" TEXT,
    "ipAddress" TEXT,
    "deviceInfo" TEXT,
    "userAgent" TEXT,
    "metadata" JSONB,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SecurityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RechargePlan" (
    "id" TEXT NOT NULL,
    "operator" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "validity" TEXT NOT NULL,
    "benefits" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RechargePlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "referral_histories" (
    "id" TEXT NOT NULL,
    "referralId" TEXT NOT NULL,
    "referredUserId" TEXT NOT NULL,
    "rewardAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "referral_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalletHistory" (
    "id" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "walletId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WalletHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationSettings" (
    "id" TEXT NOT NULL,
    "emailAlerts" BOOLEAN NOT NULL DEFAULT true,
    "smsAlerts" BOOLEAN NOT NULL DEFAULT true,
    "pushAlerts" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotificationSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "slug" TEXT,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "category" "RoleCategory",
    "parentRoleId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "slug" TEXT,
    "action" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPermission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Partner" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL DEFAULT '',
    "contactPerson" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "partnerCode" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "remarks" TEXT,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "city" TEXT,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT,
    "referralCode" TEXT,
    "rejectionReason" TEXT,
    "state" TEXT,

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "paymentMethod" TEXT,
    "purpose" TEXT NOT NULL,
    "referenceId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "transactionId" TEXT,
    "failureReason" TEXT,
    "refundAmount" DOUBLE PRECISION,
    "paidAt" TIMESTAMP(3),
    "refundedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "gateway" TEXT,
    "gatewayPaymentId" TEXT,
    "gatewayResponse" JSONB,
    "loanApplicationId" TEXT,
    "paymentId" TEXT NOT NULL,
    "remarks" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "verifiedBy" TEXT,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KYC" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "panNumber" TEXT NOT NULL,
    "dob" TEXT NOT NULL,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "pincode" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiryDate" TIMESTAMP(3),

    CONSTRAINT "KYC_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Setting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "category" TEXT NOT NULL,
    "group" TEXT,
    "description" TEXT,
    "dataType" TEXT NOT NULL DEFAULT 'string',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isEditable" BOOLEAN NOT NULL DEFAULT true,
    "isEncrypted" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportReply" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupportReply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "uploads" (
    "id" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "originalName" TEXT,
    "fileUrl" TEXT NOT NULL,
    "filePath" TEXT,
    "fileKey" TEXT,
    "fileType" TEXT,
    "mimeType" TEXT,
    "extension" TEXT,
    "fileSize" INTEGER,
    "category" TEXT,
    "documentType" TEXT,
    "uploadedBy" TEXT,
    "userId" TEXT,
    "customerId" TEXT,
    "dsaId" TEXT,
    "partnerId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "isExpired" BOOLEAN NOT NULL DEFAULT false,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "rejectedBy" TEXT,
    "rejectedAt" TIMESTAMP(3),
    "rejectReason" TEXT,
    "verifiedBy" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "documentNumber" TEXT,
    "expiryDate" TIMESTAMP(3),
    "storageProvider" TEXT,
    "bucketName" TEXT,
    "storagePath" TEXT,
    "downloadUrl" TEXT,
    "previewUrl" TEXT,
    "checksum" TEXT,
    "uploadedIp" TEXT,
    "deviceInfo" TEXT,
    "platform" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "uploads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityId" TEXT,
    "performedBy" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "module" TEXT NOT NULL,
    "newData" JSONB,
    "oldData" JSONB,
    "requestId" TEXT,
    "role" TEXT,
    "severity" "AuditSeverity" NOT NULL DEFAULT 'INFO',
    "userAgent" TEXT,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Investment" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "minAmount" DOUBLE PRECISION NOT NULL,
    "interestRate" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "category" TEXT,
    "minimumAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "activatedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "rejectedAt" TIMESTAMP(3),
    "status" "InvestmentStatus" NOT NULL DEFAULT 'PENDING',
    "totalInvested" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalInvestors" INTEGER NOT NULL DEFAULT 0,
    "totalReturns" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "riskLevel" "RiskLevel",

    CONSTRAINT "Investment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserInvestment" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "userId" TEXT NOT NULL,
    "investmentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "approvedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),

    CONSTRAINT "UserInvestment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsuranceApplication" (
    "id" TEXT NOT NULL,
    "insuranceType" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "agentId" TEXT,
    "approvedAt" TIMESTAMP(3),
    "insuranceId" TEXT,
    "rejectionReason" TEXT,
    "userId" TEXT,
    "applicationNo" TEXT NOT NULL,
    "commissionAmount" DOUBLE PRECISION DEFAULT 0,
    "expiryDate" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "startDate" TIMESTAMP(3),

    CONSTRAINT "InsuranceApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "featuredImage" TEXT,
    "category" TEXT,
    "tags" TEXT[],
    "views" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Banner" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "endDate" TIMESTAMP(3),
    "image" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "position" TEXT,
    "redirectUrl" TEXT,
    "startDate" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CMSPage" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "description" TEXT,
    "pageType" TEXT,
    "category" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" TEXT,
    "featuredImage" TEXT,
    "bannerImage" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "views" INTEGER NOT NULL DEFAULT 0,
    "publishedAt" TIMESTAMP(3),
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CMSPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditScore" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creditCardUtilization" DOUBLE PRECISION NOT NULL,
    "creditHistoryYears" INTEGER NOT NULL,
    "existingEMI" DOUBLE PRECISION NOT NULL,
    "loanDefaults" INTEGER NOT NULL,
    "monthlyIncome" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CreditScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "documentType" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "documentName" TEXT NOT NULL DEFAULT 'General Document',
    "loanId" TEXT,
    "rejectionReason" TEXT,
    "verifiedBy" TEXT,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accountHolderName" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "ifscCode" TEXT NOT NULL,
    "branchName" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "verificationStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditScoreHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bureauType" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "scoreBand" TEXT,
    "reportNumber" TEXT,
    "enquiryDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "remarks" TEXT,
    "scoreChange" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CreditScoreHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Device" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "deviceName" TEXT NOT NULL,
    "deviceType" TEXT NOT NULL,
    "browser" TEXT,
    "os" TEXT,
    "ipAddress" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsuranceClaim" (
    "id" TEXT NOT NULL,
    "claimNo" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "insuranceId" TEXT NOT NULL,
    "claimAmount" DOUBLE PRECISION NOT NULL,
    "reason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InsuranceClaim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsuranceCommission" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "commissionAmount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InsuranceCommission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsuranceDocument" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InsuranceDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsuranceAuditLog" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT,
    "action" TEXT NOT NULL,
    "performedBy" TEXT NOT NULL,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InsuranceAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Analytics" (
    "id" TEXT NOT NULL,
    "totalUsers" INTEGER NOT NULL,
    "totalLoans" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "email" TEXT,
    "city" TEXT,
    "state" TEXT,
    "pincode" TEXT,
    "productType" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "loanAmount" DOUBLE PRECISION,
    "monthlyIncome" DOUBLE PRECISION,
    "panNo" TEXT,
    "assignedTo" TEXT,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoginHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "loginTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "logoutTime" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'SUCCESS',
    "browser" TEXT,
    "os" TEXT,
    "platform" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "city" TEXT,
    "country" TEXT,
    "deviceName" TEXT,
    "deviceType" TEXT,
    "latitude" DOUBLE PRECISION,
    "loginMethod" TEXT NOT NULL,
    "longitude" DOUBLE PRECISION,
    "reason" TEXT,
    "riskScore" INTEGER DEFAULT 0,
    "sessionId" TEXT,
    "state" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "LoginHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "subject" TEXT,
    "content" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "approvedBy" TEXT,
    "category" TEXT NOT NULL,
    "totalDelivered" INTEGER NOT NULL DEFAULT 0,
    "totalFailed" INTEGER NOT NULL DEFAULT 0,
    "totalSent" INTEGER NOT NULL DEFAULT 0,
    "variables" JSONB,
    "version" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "NotificationTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Otp" (
    "id" TEXT NOT NULL,
    "phoneNo" TEXT,
    "email" TEXT,
    "purpose" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recharge_history" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rechargeId" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "operator" TEXT NOT NULL,
    "rechargeType" "RechargeType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "planDetails" TEXT,
    "previousStatus" "RechargeStatus",
    "currentStatus" "RechargeStatus" NOT NULL,
    "transactionRef" TEXT,
    "operatorTxnId" TEXT,
    "commissionAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "refundAmount" DOUBLE PRECISION,
    "refundedAt" TIMESTAMP(3),
    "refundedBy" TEXT,
    "failureReason" TEXT,
    "action" TEXT NOT NULL,
    "remarks" TEXT,
    "apiProvider" TEXT,
    "apiRequest" JSONB,
    "apiResponse" JSONB,
    "serviceType" TEXT,
    "ipAddress" TEXT,
    "deviceInfo" TEXT,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recharge_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefreshToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "deviceId" TEXT,
    "deviceType" TEXT,
    "deviceName" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "isRevoked" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "reportName" TEXT NOT NULL,
    "reportType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "format" TEXT NOT NULL,
    "generatedBy" TEXT NOT NULL,
    "fileUrl" TEXT,
    "remarks" TEXT,
    "totalRecords" INTEGER,
    "generatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Revenue" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "revenueType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "amount" DOUBLE PRECISION NOT NULL,
    "userId" TEXT,
    "loanId" TEXT,
    "partnerId" TEXT,
    "paymentId" TEXT,
    "transactionReference" TEXT,
    "description" TEXT,
    "revenueDate" TIMESTAMP(3) NOT NULL,
    "settlementDate" TIMESTAMP(3),
    "settlementReference" TEXT,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Revenue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "loginAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "logoutAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "setting_backups" (
    "id" TEXT NOT NULL,
    "backupName" TEXT NOT NULL,
    "description" TEXT,
    "settings" JSONB NOT NULL,
    "totalSettings" INTEGER NOT NULL DEFAULT 0,
    "version" TEXT DEFAULT '1.0.0',
    "backupType" TEXT NOT NULL DEFAULT 'MANUAL',
    "status" TEXT NOT NULL DEFAULT 'SUCCESS',
    "checksum" TEXT,
    "fileName" TEXT,
    "filePath" TEXT,
    "fileSize" INTEGER,
    "notes" TEXT,
    "createdBy" TEXT,
    "restoredBy" TEXT,
    "restoredAt" TIMESTAMP(3),
    "isRestored" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "setting_backups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_settings" (
    "id" TEXT NOT NULL,
    "category" "SystemSettingCategory" NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "dataType" "SystemSettingDataType" NOT NULL,
    "description" TEXT,
    "isEditable" BOOLEAN NOT NULL DEFAULT true,
    "isEncrypted" BOOLEAN NOT NULL DEFAULT false,
    "requiresRestart" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookLog" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'RECEIVED',
    "error" TEXT,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebhookLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OcrDocument" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "rawText" TEXT NOT NULL,
    "extractedData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OcrDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WhatsAppTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "body" TEXT NOT NULL,
    "headerType" TEXT,
    "headerText" TEXT,
    "footerText" TEXT,
    "buttons" JSONB,
    "variables" JSONB,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "approvedAt" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WhatsAppTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CronJobLog" (
    "id" TEXT NOT NULL,
    "jobName" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "message" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CronJobLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Aadhaar" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "maskedAadhaar" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "dob" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Aadhaar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "fastTag_slug_key" ON "fastTag"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "insurance_policyNumber_key" ON "insurance"("policyNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_userId_key" ON "Wallet"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_transactionId_key" ON "transactions"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_referenceId_key" ON "transactions"("referenceId");

-- CreateIndex
CREATE INDEX "transactions_transactionId_idx" ON "transactions"("transactionId");

-- CreateIndex
CREATE INDEX "transactions_referenceId_idx" ON "transactions"("referenceId");

-- CreateIndex
CREATE INDEX "transactions_userId_idx" ON "transactions"("userId");

-- CreateIndex
CREATE INDEX "transactions_customerId_idx" ON "transactions"("customerId");

-- CreateIndex
CREATE INDEX "transactions_dsaId_idx" ON "transactions"("dsaId");

-- CreateIndex
CREATE INDEX "transactions_partnerId_idx" ON "transactions"("partnerId");

-- CreateIndex
CREATE INDEX "transactions_status_idx" ON "transactions"("status");

-- CreateIndex
CREATE INDEX "transactions_type_idx" ON "transactions"("type");

-- CreateIndex
CREATE INDEX "transactions_category_idx" ON "transactions"("category");

-- CreateIndex
CREATE INDEX "transactions_createdAt_idx" ON "transactions"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_code_key" ON "Coupon"("code");

-- CreateIndex
CREATE UNIQUE INDEX "referrals_userId_key" ON "referrals"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "referrals_referralCode_key" ON "referrals"("referralCode");

-- CreateIndex
CREATE UNIQUE INDEX "referrals_referredUserId_key" ON "referrals"("referredUserId");

-- CreateIndex
CREATE INDEX "referrals_userId_idx" ON "referrals"("userId");

-- CreateIndex
CREATE INDEX "referrals_status_idx" ON "referrals"("status");

-- CreateIndex
CREATE INDEX "referrals_referralCode_idx" ON "referrals"("referralCode");

-- CreateIndex
CREATE INDEX "referrals_campaign_idx" ON "referrals"("campaign");

-- CreateIndex
CREATE INDEX "referrals_source_idx" ON "referrals"("source");

-- CreateIndex
CREATE INDEX "referrals_isFraud_idx" ON "referrals"("isFraud");

-- CreateIndex
CREATE INDEX "referrals_createdAt_idx" ON "referrals"("createdAt");

-- CreateIndex
CREATE INDEX "referrals_approvedAt_idx" ON "referrals"("approvedAt");

-- CreateIndex
CREATE INDEX "referrals_paidAt_idx" ON "referrals"("paidAt");

-- CreateIndex
CREATE UNIQUE INDEX "Recharge_transactionRef_key" ON "Recharge"("transactionRef");

-- CreateIndex
CREATE INDEX "Recharge_userId_idx" ON "Recharge"("userId");

-- CreateIndex
CREATE INDEX "Recharge_status_idx" ON "Recharge"("status");

-- CreateIndex
CREATE INDEX "Recharge_mobileNumber_idx" ON "Recharge"("mobileNumber");

-- CreateIndex
CREATE INDEX "Recharge_transactionRef_idx" ON "Recharge"("transactionRef");

-- CreateIndex
CREATE INDEX "Recharge_rechargeType_idx" ON "Recharge"("rechargeType");

-- CreateIndex
CREATE UNIQUE INDEX "SupportTicket_ticketNumber_key" ON "SupportTicket"("ticketNumber");

-- CreateIndex
CREATE INDEX "SecurityLog_userId_idx" ON "SecurityLog"("userId");

-- CreateIndex
CREATE INDEX "SecurityLog_action_idx" ON "SecurityLog"("action");

-- CreateIndex
CREATE INDEX "SecurityLog_createdAt_idx" ON "SecurityLog"("createdAt");

-- CreateIndex
CREATE INDEX "referral_histories_referralId_idx" ON "referral_histories"("referralId");

-- CreateIndex
CREATE INDEX "referral_histories_referredUserId_idx" ON "referral_histories"("referredUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Role_code_key" ON "Role"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Role_slug_key" ON "Role"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_code_key" ON "Permission"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_slug_key" ON "Permission"("slug");

-- CreateIndex
CREATE INDEX "Permission_module_idx" ON "Permission"("module");

-- CreateIndex
CREATE INDEX "Permission_code_idx" ON "Permission"("code");

-- CreateIndex
CREATE INDEX "Permission_status_idx" ON "Permission"("status");

-- CreateIndex
CREATE INDEX "RolePermission_roleId_idx" ON "RolePermission"("roleId");

-- CreateIndex
CREATE INDEX "RolePermission_permissionId_idx" ON "RolePermission"("permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_roleId_permissionId_key" ON "RolePermission"("roleId", "permissionId");

-- CreateIndex
CREATE INDEX "UserPermission_userId_idx" ON "UserPermission"("userId");

-- CreateIndex
CREATE INDEX "UserPermission_permissionId_idx" ON "UserPermission"("permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPermission_userId_permissionId_key" ON "UserPermission"("userId", "permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "Partner_email_key" ON "Partner"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Partner_partnerCode_key" ON "Partner"("partnerCode");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_paymentId_key" ON "Payment"("paymentId");

-- CreateIndex
CREATE INDEX "Payment_userId_idx" ON "Payment"("userId");

-- CreateIndex
CREATE INDEX "Payment_loanApplicationId_idx" ON "Payment"("loanApplicationId");

-- CreateIndex
CREATE INDEX "Payment_status_idx" ON "Payment"("status");

-- CreateIndex
CREATE INDEX "Payment_transactionId_idx" ON "Payment"("transactionId");

-- CreateIndex
CREATE INDEX "Payment_paymentId_idx" ON "Payment"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "KYC_userId_key" ON "KYC"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Setting_key_key" ON "Setting"("key");

-- CreateIndex
CREATE INDEX "Setting_key_idx" ON "Setting"("key");

-- CreateIndex
CREATE INDEX "Setting_category_idx" ON "Setting"("category");

-- CreateIndex
CREATE INDEX "Setting_group_idx" ON "Setting"("group");

-- CreateIndex
CREATE INDEX "Setting_isActive_idx" ON "Setting"("isActive");

-- CreateIndex
CREATE INDEX "uploads_userId_idx" ON "uploads"("userId");

-- CreateIndex
CREATE INDEX "uploads_customerId_idx" ON "uploads"("customerId");

-- CreateIndex
CREATE INDEX "uploads_dsaId_idx" ON "uploads"("dsaId");

-- CreateIndex
CREATE INDEX "uploads_partnerId_idx" ON "uploads"("partnerId");

-- CreateIndex
CREATE INDEX "uploads_status_idx" ON "uploads"("status");

-- CreateIndex
CREATE INDEX "uploads_category_idx" ON "uploads"("category");

-- CreateIndex
CREATE INDEX "uploads_documentType_idx" ON "uploads"("documentType");

-- CreateIndex
CREATE INDEX "uploads_createdAt_idx" ON "uploads"("createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_performedBy_idx" ON "AuditLog"("performedBy");

-- CreateIndex
CREATE INDEX "AuditLog_module_idx" ON "AuditLog"("module");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "Investment_status_idx" ON "Investment"("status");

-- CreateIndex
CREATE INDEX "Investment_type_idx" ON "Investment"("type");

-- CreateIndex
CREATE INDEX "Investment_category_idx" ON "Investment"("category");

-- CreateIndex
CREATE INDEX "Investment_isActive_idx" ON "Investment"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "InsuranceApplication_applicationNo_key" ON "InsuranceApplication"("applicationNo");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CMSPage_slug_key" ON "CMSPage"("slug");

-- CreateIndex
CREATE INDEX "CMSPage_slug_idx" ON "CMSPage"("slug");

-- CreateIndex
CREATE INDEX "CMSPage_pageType_idx" ON "CMSPage"("pageType");

-- CreateIndex
CREATE INDEX "CMSPage_category_idx" ON "CMSPage"("category");

-- CreateIndex
CREATE INDEX "CMSPage_isPublished_idx" ON "CMSPage"("isPublished");

-- CreateIndex
CREATE INDEX "CMSPage_isActive_idx" ON "CMSPage"("isActive");

-- CreateIndex
CREATE INDEX "CreditScore_userId_idx" ON "CreditScore"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BlogCategory_slug_key" ON "BlogCategory"("slug");

-- CreateIndex
CREATE INDEX "CreditScoreHistory_userId_idx" ON "CreditScoreHistory"("userId");

-- CreateIndex
CREATE INDEX "Device_userId_idx" ON "Device"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "InsuranceClaim_claimNo_key" ON "InsuranceClaim"("claimNo");

-- CreateIndex
CREATE UNIQUE INDEX "LoginHistory_sessionId_key" ON "LoginHistory"("sessionId");

-- CreateIndex
CREATE INDEX "LoginHistory_userId_idx" ON "LoginHistory"("userId");

-- CreateIndex
CREATE INDEX "LoginHistory_status_idx" ON "LoginHistory"("status");

-- CreateIndex
CREATE INDEX "LoginHistory_loginMethod_idx" ON "LoginHistory"("loginMethod");

-- CreateIndex
CREATE INDEX "LoginHistory_loginTime_idx" ON "LoginHistory"("loginTime");

-- CreateIndex
CREATE INDEX "LoginHistory_isActive_idx" ON "LoginHistory"("isActive");

-- CreateIndex
CREATE INDEX "LoginHistory_sessionId_idx" ON "LoginHistory"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationTemplate_code_key" ON "NotificationTemplate"("code");

-- CreateIndex
CREATE INDEX "Otp_phoneNo_idx" ON "Otp"("phoneNo");

-- CreateIndex
CREATE INDEX "Otp_email_idx" ON "Otp"("email");

-- CreateIndex
CREATE INDEX "recharge_history_userId_idx" ON "recharge_history"("userId");

-- CreateIndex
CREATE INDEX "recharge_history_rechargeId_idx" ON "recharge_history"("rechargeId");

-- CreateIndex
CREATE INDEX "recharge_history_currentStatus_idx" ON "recharge_history"("currentStatus");

-- CreateIndex
CREATE INDEX "recharge_history_mobileNumber_idx" ON "recharge_history"("mobileNumber");

-- CreateIndex
CREATE INDEX "recharge_history_transactionRef_idx" ON "recharge_history"("transactionRef");

-- CreateIndex
CREATE INDEX "recharge_history_operatorTxnId_idx" ON "recharge_history"("operatorTxnId");

-- CreateIndex
CREATE INDEX "recharge_history_createdAt_idx" ON "recharge_history"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_token_key" ON "RefreshToken"("token");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE INDEX "RefreshToken_token_idx" ON "RefreshToken"("token");

-- CreateIndex
CREATE INDEX "RefreshToken_expiresAt_idx" ON "RefreshToken"("expiresAt");

-- CreateIndex
CREATE INDEX "RefreshToken_isRevoked_idx" ON "RefreshToken"("isRevoked");

-- CreateIndex
CREATE INDEX "Revenue_userId_idx" ON "Revenue"("userId");

-- CreateIndex
CREATE INDEX "Revenue_loanId_idx" ON "Revenue"("loanId");

-- CreateIndex
CREATE INDEX "Revenue_partnerId_idx" ON "Revenue"("partnerId");

-- CreateIndex
CREATE INDEX "Revenue_paymentId_idx" ON "Revenue"("paymentId");

-- CreateIndex
CREATE INDEX "Revenue_status_idx" ON "Revenue"("status");

-- CreateIndex
CREATE INDEX "Revenue_source_idx" ON "Revenue"("source");

-- CreateIndex
CREATE INDEX "Revenue_revenueType_idx" ON "Revenue"("revenueType");

-- CreateIndex
CREATE INDEX "Revenue_revenueDate_idx" ON "Revenue"("revenueDate");

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Session_token_idx" ON "Session"("token");

-- CreateIndex
CREATE INDEX "Session_isActive_idx" ON "Session"("isActive");

-- CreateIndex
CREATE INDEX "setting_backups_backupName_idx" ON "setting_backups"("backupName");

-- CreateIndex
CREATE INDEX "setting_backups_backupType_idx" ON "setting_backups"("backupType");

-- CreateIndex
CREATE INDEX "setting_backups_status_idx" ON "setting_backups"("status");

-- CreateIndex
CREATE INDEX "setting_backups_createdBy_idx" ON "setting_backups"("createdBy");

-- CreateIndex
CREATE INDEX "setting_backups_createdAt_idx" ON "setting_backups"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "system_settings_key_key" ON "system_settings"("key");

-- CreateIndex
CREATE INDEX "system_settings_category_idx" ON "system_settings"("category");

-- CreateIndex
CREATE INDEX "system_settings_key_idx" ON "system_settings"("key");

-- CreateIndex
CREATE INDEX "ActivityLog_userId_idx" ON "ActivityLog"("userId");

-- CreateIndex
CREATE INDEX "ActivityLog_createdAt_idx" ON "ActivityLog"("createdAt");

-- CreateIndex
CREATE INDEX "WebhookLog_provider_idx" ON "WebhookLog"("provider");

-- CreateIndex
CREATE INDEX "WebhookLog_eventType_idx" ON "WebhookLog"("eventType");

-- CreateIndex
CREATE INDEX "WebhookLog_status_idx" ON "WebhookLog"("status");

-- CreateIndex
CREATE INDEX "WebhookLog_receivedAt_idx" ON "WebhookLog"("receivedAt");

-- CreateIndex
CREATE INDEX "OcrDocument_userId_idx" ON "OcrDocument"("userId");

-- CreateIndex
CREATE INDEX "OcrDocument_documentType_idx" ON "OcrDocument"("documentType");

-- CreateIndex
CREATE INDEX "OcrDocument_createdAt_idx" ON "OcrDocument"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "WhatsAppTemplate_name_key" ON "WhatsAppTemplate"("name");

-- CreateIndex
CREATE INDEX "WhatsAppTemplate_status_idx" ON "WhatsAppTemplate"("status");

-- CreateIndex
CREATE INDEX "WhatsAppTemplate_category_idx" ON "WhatsAppTemplate"("category");

-- CreateIndex
CREATE INDEX "WhatsAppTemplate_isActive_idx" ON "WhatsAppTemplate"("isActive");

-- CreateIndex
CREATE INDEX "WhatsAppTemplate_createdAt_idx" ON "WhatsAppTemplate"("createdAt");

-- CreateIndex
CREATE INDEX "CronJobLog_jobName_idx" ON "CronJobLog"("jobName");

-- CreateIndex
CREATE INDEX "CronJobLog_status_idx" ON "CronJobLog"("status");

-- CreateIndex
CREATE INDEX "CronJobLog_createdAt_idx" ON "CronJobLog"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Aadhaar_userId_key" ON "Aadhaar"("userId");

-- CreateIndex
CREATE INDEX "Aadhaar_status_idx" ON "Aadhaar"("status");

-- CreateIndex
CREATE INDEX "Aadhaar_createdAt_idx" ON "Aadhaar"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "User_referralCode_key" ON "User"("referralCode");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoanApplication" ADD CONSTRAINT "LoanApplication_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commission" ADD CONSTRAINT "Commission_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "LoanApplication"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commission" ADD CONSTRAINT "Commission_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commission" ADD CONSTRAINT "Commission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referredUserId_fkey" FOREIGN KEY ("referredUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recharge" ADD CONSTRAINT "Recharge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EMIPayment" ADD CONSTRAINT "EMIPayment_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "LoanApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FastagRecharge" ADD CONSTRAINT "FastagRecharge_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElectricityBill" ADD CONSTRAINT "ElectricityBill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserActivity" ADD CONSTRAINT "UserActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecurityLog" ADD CONSTRAINT "SecurityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referral_histories" ADD CONSTRAINT "referral_histories_referralId_fkey" FOREIGN KEY ("referralId") REFERENCES "referrals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referral_histories" ADD CONSTRAINT "referral_histories_referredUserId_fkey" FOREIGN KEY ("referredUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletHistory" ADD CONSTRAINT "WalletHistory_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_parentRoleId_fkey" FOREIGN KEY ("parentRoleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPermission" ADD CONSTRAINT "UserPermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPermission" ADD CONSTRAINT "UserPermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_loanApplicationId_fkey" FOREIGN KEY ("loanApplicationId") REFERENCES "LoanApplication"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KYC" ADD CONSTRAINT "KYC_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportReply" ADD CONSTRAINT "SupportReply_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "SupportTicket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportReply" ADD CONSTRAINT "SupportReply_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "uploads" ADD CONSTRAINT "uploads_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInvestment" ADD CONSTRAINT "UserInvestment_investmentId_fkey" FOREIGN KEY ("investmentId") REFERENCES "Investment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInvestment" ADD CONSTRAINT "UserInvestment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsuranceApplication" ADD CONSTRAINT "InsuranceApplication_insuranceId_fkey" FOREIGN KEY ("insuranceId") REFERENCES "insurance"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsuranceApplication" ADD CONSTRAINT "InsuranceApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditScore" ADD CONSTRAINT "CreditScore_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankAccount" ADD CONSTRAINT "BankAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditScoreHistory" ADD CONSTRAINT "CreditScoreHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsuranceClaim" ADD CONSTRAINT "InsuranceClaim_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "InsuranceApplication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsuranceClaim" ADD CONSTRAINT "InsuranceClaim_insuranceId_fkey" FOREIGN KEY ("insuranceId") REFERENCES "insurance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoginHistory" ADD CONSTRAINT "LoginHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recharge_history" ADD CONSTRAINT "recharge_history_rechargeId_fkey" FOREIGN KEY ("rechargeId") REFERENCES "Recharge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recharge_history" ADD CONSTRAINT "recharge_history_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Revenue" ADD CONSTRAINT "Revenue_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Revenue" ADD CONSTRAINT "Revenue_loanId_fkey" FOREIGN KEY ("loanId") REFERENCES "LoanApplication"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Revenue" ADD CONSTRAINT "Revenue_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Revenue" ADD CONSTRAINT "Revenue_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
