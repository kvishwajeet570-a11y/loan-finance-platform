/* ========================================
   FEATURE FLAG TYPES
======================================== */

export enum FeatureFlag {
  LOAN_MODULE = "LOAN_MODULE",
  KYC_MODULE = "KYC_MODULE",
  DSA_MODULE = "DSA_MODULE",
  PARTNER_MODULE = "PARTNER_MODULE",
  INSURANCE_MODULE = "INSURANCE_MODULE",
  FASTAG_MODULE = "FASTAG_MODULE",
  RECHARGE_MODULE = "RECHARGE_MODULE",
  WALLET_MODULE = "WALLET_MODULE",
  COMMISSION_MODULE = "COMMISSION_MODULE",
  REFERRAL_MODULE = "REFERRAL_MODULE",
  CREDIT_SCORE_MODULE = "CREDIT_SCORE_MODULE",
  INVESTMENT_MODULE = "INVESTMENT_MODULE",
  REPORT_MODULE = "REPORT_MODULE",
  ANALYTICS_MODULE = "ANALYTICS_MODULE",
  WHATSAPP_MODULE = "WHATSAPP_MODULE",
  EMAIL_MODULE = "EMAIL_MODULE",
  SMS_MODULE = "SMS_MODULE",
}

/* ========================================
   FEATURE FLAG CONFIG
======================================== */

export const FEATURE_FLAGS: Record<
  FeatureFlag,
  boolean
> = {
  [FeatureFlag.LOAN_MODULE]: true,
  [FeatureFlag.KYC_MODULE]: true,
  [FeatureFlag.DSA_MODULE]: true,
  [FeatureFlag.PARTNER_MODULE]: true,
  [FeatureFlag.INSURANCE_MODULE]: true,
  [FeatureFlag.FASTAG_MODULE]: true,
  [FeatureFlag.RECHARGE_MODULE]: true,
  [FeatureFlag.WALLET_MODULE]: true,
  [FeatureFlag.COMMISSION_MODULE]: true,
  [FeatureFlag.REFERRAL_MODULE]: true,
  [FeatureFlag.CREDIT_SCORE_MODULE]: true,
  [FeatureFlag.INVESTMENT_MODULE]: false,
  [FeatureFlag.REPORT_MODULE]: true,
  [FeatureFlag.ANALYTICS_MODULE]: true,
  [FeatureFlag.WHATSAPP_MODULE]: true,
  [FeatureFlag.EMAIL_MODULE]: true,
  [FeatureFlag.SMS_MODULE]: false,
};

/* ========================================
   FEATURE FLAG SERVICE
======================================== */

export class FeatureFlagService {
  static isEnabled(
    feature: FeatureFlag
  ): boolean {
    return FEATURE_FLAGS[feature] ?? false;
  }

  static enable(
    feature: FeatureFlag
  ): void {
    FEATURE_FLAGS[feature] = true;
  }

  static disable(
    feature: FeatureFlag
  ): void {
    FEATURE_FLAGS[feature] = false;
  }

  static getAll() {
    return FEATURE_FLAGS;
  }
}