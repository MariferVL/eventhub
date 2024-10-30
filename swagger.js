const swaggerJSDoc = require("swagger-jsdoc"); // Import swagger-jsdoc
const swaggerUi = require("swagger-ui-express"); // Import swagger-ui-express
const express = require("express"); // Import express
const app = express(); // Create an Express application

// Swagger definition
const swaggerDefinition = {
  openapi: "3.1.0",
  info: {
    title: "EventHub API",
    version: "1.0.0",
    description: "API documentation for the EventHub Reservation system",
  },
  servers: [
    {
      url: "http://localhost:5000/api", // Server URL
    },
  ],
};

// Options for swagger-jsdoc
const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ["./routes/*.js", "./models/*.js"], // Adjust as needed to include your documentation
};

// Generate the Swagger specification
const swaggerSpec = swaggerJSDoc(options);

// Export the app
module.exports = (app) => {
  // Setup the swagger-ui-express middleware
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
};
