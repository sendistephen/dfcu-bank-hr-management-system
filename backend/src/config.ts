import dotenv from 'dotenv';
import path from 'path';

// Define the environment variable that determines which .env file to load
const env = process.env.NODE_ENV || 'development';

// Construct the path to the .env file based on the environment variable
const envFile = `.env.${env}`;

// Load the environment variables from the .env file and set them as environment variables
dotenv.config({ path: path.resolve(__dirname, `../${envFile}`) });

// Export the configuration object with the loaded environment variables
export const config = {
  // Database URL
  databaseUrl: process.env.DATABASE_URL as string,

  // Port number to listen on
  port: process.env.PORT || 8900,
};
