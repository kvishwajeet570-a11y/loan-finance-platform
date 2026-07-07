"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUCCESS_LOAN_STATUSES = exports.ACTIVE_LOAN_STATUSES = exports.LOAN_STATUS = void 0;
exports.LOAN_STATUS = {
    DRAFT: "DRAFT",
    PENDING: "PENDING",
    UNDER_REVIEW: "UNDER_REVIEW",
    DOCUMENT_PENDING: "DOCUMENT_PENDING",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
    DISBURSED: "DISBURSED",
    CLOSED: "CLOSED",
};
exports.ACTIVE_LOAN_STATUSES = [
    exports.LOAN_STATUS.PENDING,
    exports.LOAN_STATUS.UNDER_REVIEW,
    exports.LOAN_STATUS.DOCUMENT_PENDING,
];
exports.SUCCESS_LOAN_STATUSES = [
    exports.LOAN_STATUS.APPROVED,
    exports.LOAN_STATUS.DISBURSED,
];
