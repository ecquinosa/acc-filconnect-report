import Eureka from "eureka-js-client";
import { Container } from "typedi";
import cloudConfig from "cloud-config-client";
import ip from "ip";
import { SERVICE, CONFIG } from "../helpers/Constants";

export async function eureka() {
  const _cloudCOnfig: cloudConfig.Config = Container.get(SERVICE.CLOUD_CONFIG);
  const service = new Eureka({
    // application instance information
    instance: {
      app: _cloudCOnfig.get(CONFIG.APP.NAME),
      hostName: ip.address(),
      ipAddr: ip.address(),
      vipAddress: _cloudCOnfig.get(CONFIG.APP.NAME),
      port: {
        $: _cloudCOnfig.get(CONFIG.SERVER.PORT),
        "@enabled": "true",
      },
      dataCenterInfo: {
        // enable this datacenter when running local
        "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
        name: "MyOwn",
        // enable this datacenter when running on AWS.
        // "@class": "com.netflix.appinfo.AmazonInfo",
        // name: "Amazon",
      },
    },
    eureka: {
      // eureka server host / port
      servicePath: "/eureka/apps",
      host: _cloudCOnfig.get(CONFIG.EUREKA.HOST),
      port: _cloudCOnfig.get(CONFIG.EUREKA.PORT),
    },
  });
  service.start();
}
