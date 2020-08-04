import { Service, Container } from "typedi";
import { SERVICE, CONFIG, ORCHESTRATION } from "../helpers/Constants";
import axios from "axios";
import client from "cloud-config-client";
import jwt from "jwt-decode";

export interface ICamundaService {
  Start(payload: any, headers: any, processDefinitionID: string);
  ToJsonObject(getTypedValue);
  GetVariables(task: any): Promise<IVariables>;
}
export interface IVariables {
  responseVariable: any;
  headersVariable: any;
  payloadVariable: any;
  statusVariable?: "success" | "failed" | "cancel";
  token: any;
}

@Service()
export default class CamundaService implements ICamundaService {
  public async Start(payload: any, headers: any, processDefinitionID: string) {
    const cloudConfig: client.Config = Container.get(SERVICE.CLOUD_CONFIG);
    const URL = cloudConfig.get(CONFIG.CAMUNDA.HOST) + `/process-definition/key/${processDefinitionID}/start`;

    const res = await axios.post(URL, {
      variables: {
        payload: {
          value: payload,
          type: "Object",
          valueInfo: {
            objectTypeName: "allcard.filconnect.payload",
            serializationDataFormat: "application/json",
          },
        },
        headers: {
          value: headers,
          type: "String",
        },
      },
    });
    if (res.status === 200)
      return {
        id: res.data.id,
      };
  }
  /**
   * This function used to convert getTypred Variables to object
   */
  public async ToJsonObject(getTypedValue) {
    return getTypedValue.type === "object"
      ? JSON.parse(getTypedValue.value)
      : getTypedValue.type === "json"
      ? getTypedValue.value
      : getTypedValue.type === "string"
      ? JSON.parse(getTypedValue.value)
      : getTypedValue.value;
  }
  /**
   *
   * @param task task variable get from a subscription
   */
  public async GetVariables(task: any): Promise<IVariables> {
    let responseJson;
    const response = task.variables.getTyped(ORCHESTRATION.VARIABLE.RESPONSE);
    if (response) responseJson = await this.ToJsonObject(response);

    const headers = task.variables.getTyped(ORCHESTRATION.VARIABLE.HEADERS);
    const headersJson = await this.ToJsonObject(headers);
    const payload = task.variables.getTyped(ORCHESTRATION.VARIABLE.PAYLOAD);
    const payloadJson = await this.ToJsonObject(payload);
    const status = task.variables.get(ORCHESTRATION.VARIABLE.STATUS);

    let token;
    let tokenDecoded;
    try {
      token = headersJson.authorization.toString().substring(7);
      tokenDecoded = jwt(token);
    } catch (error) {
      throw "Invalid token";
    }

    const variables: IVariables = {
      responseVariable: responseJson,
      headersVariable: headersJson,
      payloadVariable: payloadJson,
      statusVariable: status ? status : null,
      token: tokenDecoded,
    };
    return variables;
  }
}
