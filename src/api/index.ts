import { Router } from "express";
import example from "./routes/report";

// guaranteed to get dependencies
export default () => {
  const app = Router();
  // add all your routes here.
  example(app);

  return app;
};
