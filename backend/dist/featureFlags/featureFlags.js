"use strict";
/* ========================================
   FEATURE FLAG TYPES
======================================== */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureFlagService = exports.FEATURE_FLAGS = exports.FeatureFlag = void 0;
var FeatureFlag;
(function (FeatureFlag) {
    FeatureFlag["LOAN_MODULE"] = "LOAN_MODULE";
    FeatureFlag["KYC_MODULE"] = "KYC_MODULE";
    FeatureFlag["DSA_MODULE"] = "DSA_MODULE";
    FeatureFlag["PARTNER_MODULE"] = "PARTNER_MODULE";
    FeatureFlag["INSURANCE_MODULE"] = "INSURANCE_MODULE";
    FeatureFlag["FASTAG_MODULE"] = "FASTAG_MODULE";
    FeatureFlag["RECHARGE_MODULE"] = "RECHARGE_MODULE";
    FeatureFlag["WALLET_MODULE"] = "WALLET_MODULE";
    FeatureFlag["COMMISSION_MODULE"] = "COMMISSION_MODULE";
    FeatureFlag["REFERRAL_MODULE"] = "REFERRAL_MODULE";
    FeatureFlag["CREDIT_SCORE_MODULE"] = "CREDIT_SCORE_MODULE";
    FeatureFlag["INVESTMENT_MODULE"] = "INVESTMENT_MODULE";
    FeatureFlag["REPORT_MODULE"] = "REPORT_MODULE";
    FeatureFlag["ANALYTICS_MODULE"] = "ANALYTICS_MODULE";
    FeatureFlag["WHATSAPP_MODULE"] = "WHATSAPP_MODULE";
    FeatureFlag["EMAIL_MODULE"] = "EMAIL_MODULE";
    FeatureFlag["SMS_MODULE"] = "SMS_MODULE";
})(FeatureFlag || (exports.FeatureFlag = FeatureFlag = {}));
/* ========================================
   FEATURE FLAG CONFIG
======================================== */
exports.FEATURE_FLAGS = {
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
class FeatureFlagService {
    static isEnabled(feature) {
        return exports.FEATURE_FLAGS[feature] ?? false;
    }
    static enable(feature) {
        exports.FEATURE_FLAGS[feature] = true;
    }
    static disable(feature) {
        exports.FEATURE_FLAGS[feature] = false;
    }
    static getAll() {
        return exports.FEATURE_FLAGS;
    }
}
exports.FeatureFlagService = FeatureFlagService;
