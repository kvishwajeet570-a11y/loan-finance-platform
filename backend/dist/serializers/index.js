"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./user.serializer"), exports);
// Missing file
// export * from "./auth.serializer";
__exportStar(require("./loan.serializer"), exports);
__exportStar(require("./customer.serializer"), exports);
__exportStar(require("./dsa.serializer"), exports);
__exportStar(require("./partner.serializer"), exports);
// Missing / disabled
// export * from "./kyc.serializer";
__exportStar(require("./insurance.serializer"), exports);
__exportStar(require("./fastag.serializer"), exports);
__exportStar(require("./profile.serializer"), exports);
__exportStar(require("./leaderboard.serializer"), exports);
// Missing file
// export * from "./analytics.serializer";
__exportStar(require("./dashboard.serializer"), exports);
// Missing files
// export * from "./admin.serializer";
// export * from "./superAdmin.serializer";
__exportStar(require("./upload.serializer"), exports);
// Missing files
// export * from "./bank.serializer";
// export * from "./banner.serializer";
__exportStar(require("./faq.serializer"), exports);
