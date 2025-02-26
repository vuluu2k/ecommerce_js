// level 0
// const config = {
//   app: {
//     port: process.env.PORT || 3000,
//   },
//   db: {
//     host: "localhost",
//     port: 27017,
//     name: "ecommerce",
//   },
// };

// level 01
// Configuration file for MongoDB connection settings
// Supports different environments (development and production)

// Development environment configuration
const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 3000, // Application port for development
  },
  db: {
    host: process.env.DEV_DB_HOST || "localhost", // MongoDB host address
    port: process.env.DEV_DB_PORT || 27017, // MongoDB port number
    name: process.env.DEV_DB_NAME || "ecommerce", // Database name
  },
};

// Production environment configuration
const prod = {
  app: {
    port: process.env.PROD_APP_PORT || 3000, // Application port for production
  },
  db: {
    host: process.env.PROD_DB_HOST || "localhost", // MongoDB host address
    port: process.env.PROD_DB_PORT || 27017, // MongoDB port number
    name: process.env.PROD_DB_NAME || "ecommerce", // Database name
  },
};

// Combined configuration object
const config = {
  dev,
  prod,
};

// Select configuration based on current environment
const env = process.env.NODE_ENV || "dev";

module.exports = config[env];
