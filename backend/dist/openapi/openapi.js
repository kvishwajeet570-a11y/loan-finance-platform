"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const config = {
    openapi: "3.0.0",
    info: {
        title: "Loan Finance API",
        version: "1.0.0",
        description: "Loan Finance Platform API Documentation",
    },
    servers: [
        {
            url: "http://localhost:5000/api",
            description: "Development Server",
        },
    ],
    paths: {},
};
const options = {
    definition: config,
    apis: [
        "./src/routes/*.ts",
        "./src/modules/**/*.routes.ts",
        "./src/modules/**/*.route.ts",
    ],
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
