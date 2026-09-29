import swaggerJsdoc from "swagger-jsdoc";
import { OpenAPIV3 } from "openapi-types";

const config: OpenAPIV3.Document = {
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

const options: swaggerJsdoc.Options = {
  definition: config,

  apis: [
    "./src/routes/*.ts",
    "./src/modules/**/*.routes.ts",
    "./src/modules/**/*.route.ts",
  ],
};

export const swaggerSpec = swaggerJsdoc(options);