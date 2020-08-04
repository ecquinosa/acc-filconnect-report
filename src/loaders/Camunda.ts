import { Client, logger } from "camunda-external-task-client-js";
import { Container } from "typedi";
import cloudConfig from "cloud-config-client";
import { SERVICE, CONFIG } from "../helpers/Constants";
import reportSubscription from "../subscription/report";

export function camundaInstance(): Client {
  const _cloudCOnfig: cloudConfig.Config = Container.get(SERVICE.CLOUD_CONFIG);
  return new Client({
    baseUrl: _cloudCOnfig.get(CONFIG.CAMUNDA.HOST),
    use: logger,
  });
}

export async function camundaLoder() {
  await reportSubscription();
}
