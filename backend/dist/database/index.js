"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = exports.redis = exports.prisma = void 0;
var prisma_1 = require("../prisma/prisma");
Object.defineProperty(exports, "prisma", { enumerable: true, get: function () { return __importDefault(prisma_1).default; } });
var redis_1 = require("./redis/redis");
Object.defineProperty(exports, "redis", { enumerable: true, get: function () { return __importDefault(redis_1).default; } });
var Database_1 = require("./Database");
Object.defineProperty(exports, "database", { enumerable: true, get: function () { return __importDefault(Database_1).default; } });
