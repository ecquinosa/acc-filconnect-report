import { Client, Variables } from "camunda-external-task-client-js";
import { Container } from "typedi";
import { SERVICE, ORCHESTRATION, RESPONSE_CODE, STATUS } from "../helpers/Constants";
import log from "../loaders/Logger";
import { IKycService } from "../service/kycService";
import { ICamundaService } from "../service/CamundaService";
import { IResult, utilResponsePayloadSystemError, utilResponsePayloadSuccess, utilResponsePayloadSuccessNoParam } from "../helpers/Utility";

let camundaService: ICamundaService;
let kycService: IKycService;

export default async function () {
  const camundaClient: Client = Container.get(SERVICE.CAMUNDA);
  camundaService = Container.get(SERVICE.CAMUNDA_SERVICE);
  kycService = Container.get(SERVICE.KYC);
  camundaClient.subscribe(ORCHESTRATION.TOPIC.REPORT.KYC_SEARCH_CITIZEN, await kycSearchCitizen); 
  camundaClient.subscribe(ORCHESTRATION.TOPIC.REPORT.GET_FILE, await getFile); 
  camundaClient.subscribe(ORCHESTRATION.TOPIC.REPORT.DELETE_FILE, await deleteFile); 
}

async function kycSearchCitizen({ task, taskService }) {

  const variables = new Variables();    
  let resultService: IResult = null;

  try {
    const taskVariables = await camundaService.GetVariables(task);

    // get payload and response value.
    const payload = taskVariables.payloadVariable.payload;
    const response = taskVariables.responseVariable ? taskVariables.responseVariable.response : undefined;
    //const entity = JSON.parse(task.variables.get("payload"));

    resultService = await kycService.SearchCitizen(payload);
    // log.info(JSON.stringify(resultService.value));
    // log.info(JSON.stringify(resultService.value.response));
    setTypedVariable(variables, resultService.value);    
  } catch (error) {
    resultService = utilResponsePayloadSystemError(error);
    //log.info("🔥 kycSearchCitizen failed result : %o", JSON.stringify(resultService.value));
    setTypedVariable(variables, resultService.value);
  }  

  log.info("🔥 kycSearchCitizen result : %o", JSON.stringify(resultService.value));

  variables.set("status", resultService.status);

  taskService.complete(task, variables);
}

async function getFile({ task, taskService }) {

  const variables = new Variables();    
  let resultService: IResult = null;

  try {
    const taskVariables = await camundaService.GetVariables(task);

    // get payload and response value.
    const payload = taskVariables.payloadVariable.payload;
    const response = taskVariables.responseVariable ? taskVariables.responseVariable.response : undefined;
    //const entity = JSON.parse(task.variables.get("payload"));

    //console.log(payload.payload);
    resultService = await kycService.getFile(payload);
    // log.info(JSON.stringify(resultService.value));
    // log.info(JSON.stringify(resultService.value.response));
    setTypedVariable(variables, resultService.value);    
  } catch (error) {
    resultService = utilResponsePayloadSystemError(error);
    //log.info("🔥 getFile failed result : %o", JSON.stringify(resultService.value));
    setTypedVariable(variables, resultService.value);
  }  

  log.info("🔥 getFile result : %o", JSON.stringify(resultService.value));

  variables.set("status", resultService.status);

  taskService.complete(task, variables);
}

async function deleteFile({ task, taskService }) {

  const variables = new Variables();    
  let resultService: IResult = null;

  try {
    const taskVariables = await camundaService.GetVariables(task);

    // get payload and response value.
    const payload = taskVariables.payloadVariable.payload;
    const response = taskVariables.responseVariable ? taskVariables.responseVariable.response : undefined;    

    resultService = await kycService.deleteFile(payload);    

    setTypedVariable(variables, resultService.value);    
  } catch (error) {    
    resultService = utilResponsePayloadSystemError(error);    
    setTypedVariable(variables, resultService.value);
  }  

  log.info("🔥 deleteFile result : %o", JSON.stringify(resultService.value));

  variables.set("status", resultService.status);

  taskService.complete(task, variables);
}

async function setTypedVariable(variables: Variables, responsePayload) {
  variables.setTyped(ORCHESTRATION.VARIABLE.RESPONSE, {
    value: JSON.stringify(responsePayload),
    type: "Object",
    valueInfo: {
      objectTypeName: "allcard.filconnect.response",
      serializationDataFormat: "application/json",
    },
  });
}
