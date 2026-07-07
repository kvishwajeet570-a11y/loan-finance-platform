"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SALES_ROLES = exports.ADMIN_ROLES = exports.ROLES = void 0;
exports.ROLES = {
    SUPER_ADMIN: "SUPER_ADMIN",
    ADMIN: "ADMIN",
    PARTNER: "PARTNER",
    DSA: "DSA",
    EMPLOYEE: "EMPLOYEE",
    CUSTOMER: "CUSTOMER",
};
exports.ADMIN_ROLES = [
    exports.ROLES.SUPER_ADMIN,
    exports.ROLES.ADMIN,
];
exports.SALES_ROLES = [
    exports.ROLES.PARTNER,
    exports.ROLES.DSA,
];
