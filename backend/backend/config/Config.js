import "dotenv/config";

export const Config = () => {
  return {
    PORT: process.env.PORT || 5000
  };
};

export default Config;
