const swaggerJSDoc = require('swagger-jsdoc'); // Import swagger-jsdoc
const swaggerUi = require('swagger-ui-express'); // Import swagger-ui-express
const express = require('express'); // Import express
const app = express(); // Create an Express application

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'EventHub API',
    version: '1.0.0',
    description: 'API documentation for the EventHub Reservation system',
  },
  servers: [
    {
      url: 'http://localhost:3000', // Server URL
    },
  ],
};

// Options for swagger-jsdoc
const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./routes/*.js', './models/*.js'],
};

// Generate the Swagger specification
const swaggerSpec = swaggerJSDoc(options);

// Setup the swagger-ui-express middleware
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = app; // Export the app
