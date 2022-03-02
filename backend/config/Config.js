import "dotenv/config";

export const Config = () => {
  return {
    PORT: process.env.PORT || 5000,
    SERVICE_AUTH_KEY: process.env.SERVICE_AUTH_KEY,
    JWT_SECRET: process.env.JWT_SECRET
  };
};

export default Config;
