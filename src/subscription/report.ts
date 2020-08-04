import { Client, Variables } from "camunda-external-task-client-js";
import { Container } from "typedi";
import { SERVICE, ORCHESTRATION, RESPONSE_CODE, STATUS } from "../helpers/Constants";
import log from "../loaders/Logger";
import { IKycService } from "../service/kycService";
import { ICamundaService } from "../service/CamundaService";
import { IResult, utilResponsePayloadSystemError } from "../helpers/Utility";

let camundaService: ICamundaService;
let kycService: IKycService;

export default async function () {
  const camundaClient: Client = Container.get(SERVICE.CAMUNDA);
  camundaService = Container.get(SERVICE.CAMUNDA_SERVICE);
  kycService = Container.get(SERVICE.KYC);
  camundaClient.subscribe(ORCHESTRATION.TOPIC.REPORT.KYC_SEARCH_CITIZEN, await kycSearchCitizen); 
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

    //log.info("🔥 getMemberWithMissingImages success result : %o", JSON.stringify(responsePayload));
    setTypedVariable(variables, resultService.value);    
  } catch (error) {
    resultService = utilResponsePayloadSystemError(error);
    log.info("🔥 kycSearchCitizen failed result : %o", JSON.stringify(resultService.value));
    setTypedVariable(variables, resultService.value);
  }  

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

// // this will only process one data.
// async function kycSearchCitizen({ task, taskService }) {
//   let variables = new Variables();
//   try {
//     // This funtion will populate the camunda variables to JSON.
//     const taskVariables = await camundaService.GetVariables(task);

//     // get payload and response value.
//     const payload = taskVariables.payloadVariable.payload;
//     const response = taskVariables.responseVariable ? taskVariables.responseVariable.response : undefined;
//     // concat data so that we can process event the required properties are from payload or response.
//     let processData = payload;
//     if (response != undefined) processData = { ...payload, ...response[0] };
//     console.log(processData);

//     // passing the concatinated data.
//     const createExampleResult = await kycService.Search(processData);

//     // get the new response and previous response.
//     let nextResponse = createExampleResult.value.response;
//     if (response != undefined)
//       nextResponse = {
//         ...response[0],
//         ...createExampleResult.value.response,
//       };
//     // set the new response concatinated.
//     createExampleResult.value.response = nextResponse;

//     log.info(JSON.stringify(createExampleResult.value));
//     // set the status  and new response.
//     variables.set(ORCHESTRATION.VARIABLE.STATUS, createExampleResult.status);
//     variables.set(ORCHESTRATION.VARIABLE.RESPONSE, createExampleResult.value);

//     log.info(`update example ${createExampleResult.status} id:${task.processInstanceId}`);
//   } catch (error) {
//     // if something went wrong..
//     let errrorResponse = {
//       responseCode: RESPONSE_CODE.SYSTEM_ERROR.CODE,
//       responseMessage: RESPONSE_CODE.SYSTEM_ERROR.MESSAGE,
//       responseCount: 0,
//       totalCount: 0,
//       response: [],
//     };
//     variables.set(ORCHESTRATION.VARIABLE.STATUS, STATUS.FAILED);
//     variables.set(ORCHESTRATION.VARIABLE.RESPONSE, errrorResponse);
//     log.error(`update example error id:${task.processInstanceId} error: ${error}`);
//   }
//   taskService.complete(task, variables);
// }

