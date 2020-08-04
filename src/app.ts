import express, { Application, Request, Response, NextFunction } from "express";
//import config from "./config";
import Logger from "./loaders/Logger";
import client from "cloud-config-client";

// Main class of the service.
async function Main() {
  const app: Application = express();

  // This will initialize and get the configuration from cloud config server
  var configuration = (await client.load({
    endpoint: process.env.CLOUD_CONFIG_URL,
    name: process.env.CLOUD_CONFIG_APP_NAME,
    context: process.env,
  })) as client.Config;

  // in /loaders has been called to initialize all the required frameworks.
  await require("./loaders").default({
    expressApp: app,
    cloudConfig: configuration,
  });

  const port = configuration.get("server.port");
  const appname = configuration.get("spring.application.name");

  app.listen(port, (err) => {
    if (err) {
      Logger.error(err);
      process.exit(1);
      return;
    }
    Logger.info(`
      ######################################################################
      🛡️  ${appname} service listening on port: ${port} 🛡️ 
      ######################################################################
    `);
  });
}
Main();
