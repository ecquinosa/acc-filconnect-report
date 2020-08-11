import Logger from "./Logger";
import expressLoader from "./Express";
import dependencyInjection from "./DependencyInjection";
import { typeORM } from "./TypeORM";
import { eureka } from "./Eureka";
import { camundaLoder } from "./Camunda";
export default async ({ expressApp, cloudConfig }) => {
  /**
   *
   * We are injecting the mongoose models into the DI container.
   * I know this is controversial but will provide a lot of flexibility at the time
   * of writing unit tests, just go and check how beautiful they are!
   */
   //console.log("configuration", cloudConfig);
   const reportModel = {
    name: "reportModel",
    // Notice the require syntax and the '.default'
    model: require("../entity/kycSearchCitizen").default,
  };

  await dependencyInjection([reportModel], cloudConfig); 

  //await dependencyInjection(cloudConfig);
  Logger.info("✌️ Dependency Injection");

  //await eureka();
  Logger.info("✌️ Service Registry");

  // load express configuration
  await expressLoader({ app: expressApp });
  Logger.info("✌️ Express loaded");

  await typeORM();
  Logger.info("✌️ Load DB Connection");

  await camundaLoder();
  Logger.info("✌️ Load Subscription");
};
