import express from "express";
import Engine from "./backend/engine/Engine";

export const AppEngine = () => {
  const app = express();
  return {
    StartServer: () => {
      new Engine(app).init();
    }
  };
};

export default AppEngine;
