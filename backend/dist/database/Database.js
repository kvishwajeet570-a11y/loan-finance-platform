"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = exports.prisma = void 0;
const client_1 = __importDefault(require("./database/prisma/client"));
exports.prisma = client_1.default;
const redis_1 = __importDefault(require("./database/prisma/redis/redis"));
exports.redis = redis_1.default;
exports.default = {
    prisma: client_1.default,
    redis: redis_1.default,
};
