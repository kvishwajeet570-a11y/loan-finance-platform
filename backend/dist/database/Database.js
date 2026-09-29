"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = exports.prisma = void 0;
const prisma_1 = __importDefault(require("../prisma/prisma"));
exports.prisma = prisma_1.default;
const redis_1 = __importDefault(require("./redis/redis"));
exports.redis = redis_1.default;
exports.default = {
    prisma: prisma_1.default,
    redis: redis_1.default,
};
