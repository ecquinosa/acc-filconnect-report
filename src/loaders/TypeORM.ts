import { createConnection, Connection } from "typeorm";
import { KycSearchCitizen } from "../entity/kycSearchCitizen";
import { Container } from "typedi";
import client from "cloud-config-client";
import { CONFIG, SERVICE } from "../helpers/Constants";

export async function typeORM() {
  const _cloudCOnfig: client.Config = Container.get(SERVICE.CLOUD_CONFIG);
  await createConnection({
    type: _cloudCOnfig.get(CONFIG.DB.TYPE),
    host: _cloudCOnfig.get(CONFIG.DB.HOST),
    port: _cloudCOnfig.get(CONFIG.DB.PORT),
    username: _cloudCOnfig.get(CONFIG.DB.USER),
    password: _cloudCOnfig.get(CONFIG.DB.PASSWORD),
    database: _cloudCOnfig.get(CONFIG.DB.NAME),
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
  },
    entities: [
      KycSearchCitizen
    ],
    // always disable this on production
    synchronize: true, // this property updates database tables dont use this on production
    options: {
      encrypt: true,
      enableArithAbort: true,
      useUTC: true, // we enable it so that typeorm will not change the timezone of the fetch data.
    },
  });
}
