import { Container } from "typedi";
import LoggerInstance from "./Logger";
import KycService from "../service/kycService";
import CamundaService from "../service/CamundaService";
import { SERVICE } from "../helpers/Constants";
import { camundaInstance } from "./Camunda";

// export default (cloudConfig) => {
  export default (models: { name: string; model: any }[], cloudConfig) => {
    try {
      // Inject your services here.    
      models.forEach((m) => {
        Container.set(m.name, m.model);
      });
    
    // Inject logger
    Container.set(SERVICE.LOGGER, LoggerInstance);
    // Inject configuration to access anywhere of the project
    Container.set(SERVICE.CLOUD_CONFIG, cloudConfig);
    LoggerInstance.info("✌️ Cloud Configuration");

    // Service injection and instantiate
    Container.set(SERVICE.CAMUNDA_SERVICE, new CamundaService());
    Container.set(SERVICE.KYC, new KycService());
    Container.set(SERVICE.REPORT, new KycService());

    // Inject camunda to access anywhere of the project
    Container.set(SERVICE.CAMUNDA, camundaInstance());
    LoggerInstance.info("✌️ Load Camunda");

    //return { agenda: agendaInstance };
  } catch (e) {
    LoggerInstance.error("🔥 Error on dependency injector loader: %o", e);
    throw e;
  }
};
