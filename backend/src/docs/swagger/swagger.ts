import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJsdoc.Options = {

  definition: {

    openapi: "3.0.0",

    info: {
      title: "Loan Finance API",
      version: "1.0.0",
      description:
        "Loan Finance CRM Backend APIs",
    },

    servers: [
      {
        url:
          process.env.API_URL ||
          "http://localhost:5000/api",
        description:
          "Development Server",
      },
    ],

    components: {

      securitySchemes: {

        bearerAuth: {

          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: [
    "./src/routes/**/*.ts",
    "./src/controllers/**/*.ts",
  ],
};

const swaggerSpec =
  swaggerJsdoc(options);

export const setupSwagger = (
  app: Express
) => {

  app.use(
    "/api/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
    })
  );

};