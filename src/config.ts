import dotenv from "dotenv";

dotenv.config();

interface Config {
  port: number;
  mongo_uri: string;
  jwtSecret: string;
  jwtExpiration: string;
  refreshTokenExpiration: string;
  salt_rounds_for_hashing: number;
}

const config: Config = {
  port: parseInt(process.env.PORT || "8080", 10),
  mongo_uri: process.env.MONGO_URI as string,
  jwtSecret: process.env.JWT_SECRET || "default_secret",
  jwtExpiration: process.env.JWT_EXPIRATION || "15m",
  refreshTokenExpiration: process.env.REFRESH_TOKEN_EXPIRATION || "14d",
  salt_rounds_for_hashing: 10,
};

export default config;
