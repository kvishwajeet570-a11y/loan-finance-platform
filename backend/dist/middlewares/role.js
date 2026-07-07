"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALL_ROLES = exports.LOAN_ROLES = exports.STAFF_ROLES = exports.ADMIN_ROLES = exports.Role = void 0;
var Role;
(function (Role) {
    Role["SUPER_ADMIN"] = "superadmin";
    Role["ADMIN"] = "admin";
    Role["MANAGER"] = "manager";
    Role["DSA"] = "dsa";
    Role["PARTNER"] = "partner";
    Role["CUSTOMER"] = "customer";
})(Role || (exports.Role = Role = {}));
exports.ADMIN_ROLES = [
    Role.SUPER_ADMIN,
    Role.ADMIN,
];
exports.STAFF_ROLES = [
    Role.SUPER_ADMIN,
    Role.ADMIN,
    Role.MANAGER,
];
exports.LOAN_ROLES = [
    Role.SUPER_ADMIN,
    Role.ADMIN,
    Role.DSA,
    Role.PARTNER,
];
exports.ALL_ROLES = Object.values(Role);
