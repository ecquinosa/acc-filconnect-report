import { Client, Variables } from "camunda-external-task-client-js";
import { Container } from "typedi";
import { SERVICE, ORCHESTRATION, RESPONSE_CODE, STATUS } from "../helpers/Constants";
import log from "../loaders/Logger";
import { IKycService } from "../service/kycService";
import { ICamundaService } from "../service/CamundaService";
import { IResult, utilResponsePayloadSystemError, utilResponsePayloadSuccess, utilResponsePayloadSuccessNoParam, utilResponsePayloadInvalidParameter } from "../helpers/Utility";
import LoggerInstance from "../loaders/Logger";

let camundaService: ICamundaService;
let kycService: IKycService;

export default async function () {
  const camundaClient: Client = Container.get(SERVICE.CAMUNDA);
  camundaService = Container.get(SERVICE.CAMUNDA_SERVICE);
  kycService = Container.get(SERVICE.KYC);
  camundaClient.subscribe(ORCHESTRATION.TOPIC.REPORT.KYC_SEARCH_CITIZEN, await kycSearchCitizen); 
  camundaClient.subscribe(ORCHESTRATION.TOPIC.REPORT.KYC_CREATE_CITIZEN, await kycCreateCitizen); 
  camundaClient.subscribe(ORCHESTRATION.TOPIC.REPORT.KYC_UPDATE_CITIZEN, await kycUpdateCitizen); 
  camundaClient.subscribe(ORCHESTRATION.TOPIC.REPORT.KYC_UPDATE_ADDRESS_CITIZEN, await kycUpdateAddressCitizen); 
  camundaClient.subscribe(ORCHESTRATION.TOPIC.REPORT.KYC_UPDATE_CONTACTINFO_CITIZEN, await kycUpdateContactInfoCitizen); 
  camundaClient.subscribe(ORCHESTRATION.TOPIC.REPORT.KYC_UPDATE_AGE_CITIZEN, await kycUpdateAgeCitizen); 
  camundaClient.subscribe(ORCHESTRATION.TOPIC.REPORT.GET_FILE, await getFile); 
  camundaClient.subscribe(ORCHESTRATION.TOPIC.REPORT.DELETE_FILE, await deleteFile); 

  camundaClient.subscribe(ORCHESTRATION.TOPIC.REPORT.GET_SUMMARY_PER_BRGY, await getSummaryPerBrgy); 
  camundaClient.subscribe(ORCHESTRATION.TOPIC.REPORT.GET_SUMMARY_PER_AGE_BRACKET, await getSummaryPerAgeBracket); 
  camundaClient.subscribe(ORCHESTRATION.TOPIC.REPORT.GET_SUMMARY_PER_AGE, await getSummaryPerAge); 
  camundaClient.subscribe(ORCHESTRATION.TOPIC.REPORT.GET_SUMMARY_PER_EMPLOYMENT_STATUS, await getSummaryPerEmploymentStatus); 
  camundaClient.subscribe(ORCHESTRATION.TOPIC.REPORT.GET_SUMMARY_SENIORCITIZEN_PER_BRGY, await getSummarySeniorCitizenPerBrgy); 

  // camundaClient.subscribe(ORCHESTRATION.TOPIC.REPORT.DELETE_FILE, await get); 
  // camundaClient.subscribe(ORCHESTRATION.TOPIC.REPORT.DELETE_FILE, await deleteFile); 
  // camundaClient.subscribe(ORCHESTRATION.TOPIC.REPORT.DELETE_FILE, await deleteFile); 
  // camundaClient.subscribe(ORCHESTRATION.TOPIC.REPORT.DELETE_FILE, await deleteFile); 
}

async function kycCreateCitizen({ task, taskService }) {
  const variables = new Variables();    
  let resultService: IResult = null;

  try {
    const taskVariables = await camundaService.GetVariables(task);

    // get payload and response value.
    const payload = taskVariables.payloadVariable.payload;
    const response = taskVariables.responseVariable ? taskVariables.responseVariable.response : undefined;    

    var memberId = "00000000-0000-0000-0000-000000000000";  

    resultService = await kycService.createCitizen(payload, response);
    
    setTypedVariable(variables, resultService.value);    
  } catch (error) {
    console.log(error);
    resultService = utilResponsePayloadSystemError(error);    
    setTypedVariable(variables, resultService.value);
  }  

  log.info("🔥 kycCreateCitizen result : %o", JSON.stringify(resultService.value));

  variables.set("status", resultService.status);

  taskService.complete(task, variables);
}

async function kycUpdateCitizen({ task, taskService }) {
  const variables = new Variables();    
  let resultService: IResult = null;

  try {
    const taskVariables = await camundaService.GetVariables(task);

    // get payload and response value.
    const payload = taskVariables.payloadVariable.payload;
    const response = taskVariables.responseVariable ? taskVariables.responseVariable.response : undefined;        

    resultService = await kycService.update(payload);
    
    setTypedVariable(variables, resultService.value);    
  } catch (error) {
    console.log(error);
    resultService = utilResponsePayloadSystemError(error);    
    setTypedVariable(variables, resultService.value);
  }  

  log.info("🔥 kycUpdateCitizen result : %o", JSON.stringify(resultService.value));

  variables.set("status", resultService.status);

  taskService.complete(task, variables);
}

async function kycUpdateAddressCitizen({ task, taskService }) {
  const variables = new Variables();    
  let resultService: IResult = null;

  try {
    const taskVariables = await camundaService.GetVariables(task);

    // get payload and response value.
    const payload = taskVariables.payloadVariable.payload;
    const response = taskVariables.responseVariable ? taskVariables.responseVariable.response : undefined;        

    resultService = await kycService.updateAddress(payload);
    
    setTypedVariable(variables, resultService.value);    
  } catch (error) {
    console.log(error);
    resultService = utilResponsePayloadSystemError(error);    
    setTypedVariable(variables, resultService.value);
  }  

  log.info("🔥 kycUpdateAddressCitizen result : %o", JSON.stringify(resultService.value));

  variables.set("status", resultService.status);

  taskService.complete(task, variables);
}

async function kycUpdateContactInfoCitizen({ task, taskService }) {
  const variables = new Variables();    
  let resultService: IResult = null;

  try {
    const taskVariables = await camundaService.GetVariables(task);

    // get payload and response value.
    const payload = taskVariables.payloadVariable.payload;
    const response = taskVariables.responseVariable ? taskVariables.responseVariable.response : undefined;        

    resultService = await kycService.updateContactInfo(payload);
    
    setTypedVariable(variables, resultService.value);    
  } catch (error) {
    console.log(error);
    resultService = utilResponsePayloadSystemError(error);    
    setTypedVariable(variables, resultService.value);
  }  

  log.info("🔥 kycUpdateContactInfoCitizen result : %o", JSON.stringify(resultService.value));

  variables.set("status", resultService.status);

  taskService.complete(task, variables);
}

async function kycUpdateAgeCitizen({ task, taskService }) {
  const variables = new Variables();    
  let resultService: IResult = null;

  try {
    const taskVariables = await camundaService.GetVariables(task);

    // get payload and response value.
    const payload = taskVariables.payloadVariable.payload;
    const response = taskVariables.responseVariable ? taskVariables.responseVariable.response : undefined;        

    resultService = await kycService.updateAge(payload);
    
    setTypedVariable(variables, resultService.value);    
  } catch (error) {
    console.log(error);
    resultService = utilResponsePayloadSystemError(error);    
    setTypedVariable(variables, resultService.value);
  }  

  log.info("🔥 kycUpdateAgeCitizen result : %o", JSON.stringify(resultService.value));

  variables.set("status", resultService.status);

  taskService.complete(task, variables);
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

    resultService = await kycService.SearchCitizenv2(payload);
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
    resultService = await kycService.getFilev2(payload);
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

    resultService = await kycService.deleteFilev2(payload);    

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

async function getSummaryPerBrgy({ task, taskService }) {
  const variables = new Variables();
  let resultService: IResult = null;
  let recordCount = 0;

  try {
    const taskVariables = await camundaService.GetVariables(task);

    // get payload and response value.
    const payload = taskVariables.payloadVariable;
    const response = taskVariables.responseVariable ? taskVariables.responseVariable.response : undefined;

    var validationResult = await kycService.validateGetSummaryBrgy(payload); 

    if (validationResult.length === 0) {      
      var result = await kycService.GetSummaryPerBrgy(payload);
      if (result) {        
        if (payload.pagination.page == 0) {
          if (payload.pagination.count > 0) {
            payload.pagination.count = 0;
            var resultCount = await kycService.GetSummaryPerBrgy(payload);
            recordCount = resultCount.length;
          }
          else recordCount = result.length;
        }

        resultService = utilResponsePayloadSuccess(result, result.length, recordCount);
        log.info("🔥 getSummaryPerBrgy success result : %o", JSON.stringify(resultService.value));        
      } else {
        resultService = utilResponsePayloadSystemError("Failed to get summary");
        log.error("🔥 getSummaryPerBrgy success result : %o", JSON.stringify(resultService.value));        
      }
    } else {
      resultService = utilResponsePayloadInvalidParameter("Invalid payload");
      log.error("🔥 getSummaryPerBrgy success result : %o", JSON.stringify(resultService.value));      
    }
  } catch (error) {
    console.log(error);
    resultService = utilResponsePayloadSystemError(error);    
    log.error("🔥 getSummaryPerBrgy success result : %o", JSON.stringify(resultService.value));      
  }

  setTypedVariable(variables, resultService.value);  

  variables.set("status", resultService.status);

  taskService.complete(task, variables);
}

async function getSummaryPerAgeBracket({ task, taskService }) {
  const variables = new Variables();
  let resultService: IResult = null;
  let recordCount = 0;

  try {
    const taskVariables = await camundaService.GetVariables(task);

    // get payload and response value.
    const payload = taskVariables.payloadVariable;
    const response = taskVariables.responseVariable ? taskVariables.responseVariable.response : undefined;

    var validationResult = await kycService.validateGetSummaryBrgy(payload);

    if (validationResult.length === 0) {      
      var result = await kycService.GetSummaryPerAgeBracket(payload);
      if (result) {        
        if (payload.pagination.page == 0) {
          if (payload.pagination.count > 0) {
            payload.pagination.count = 0;
            var resultCount = await kycService.GetSummaryPerAgeBracket(payload);
            recordCount = resultCount.length;
          }
          else recordCount = result.length;
        }

        resultService = utilResponsePayloadSuccess(result, result.length, recordCount);
        log.info("🔥 getSummaryPerAgeBracket success result : %o", JSON.stringify(resultService.value));        
      } else {
        resultService = utilResponsePayloadSystemError("Failed to get summary");
        log.error("🔥 getSummaryPerAgeBracket success result : %o", JSON.stringify(resultService.value));        
      }
    } else {
      resultService = utilResponsePayloadInvalidParameter("Invalid payload");
      log.error("🔥 getSummaryPerAgeBracket success result : %o", JSON.stringify(resultService.value));      
    }
  } catch (error) {
    console.log(error);
    resultService = utilResponsePayloadSystemError(error);    
    log.error("🔥 getSummaryPerAgeBracket success result : %o", JSON.stringify(resultService.value));      
  }

  setTypedVariable(variables, resultService.value);  

  variables.set("status", resultService.status);

  taskService.complete(task, variables);
}

async function getSummaryPerAge({ task, taskService }) {
  const variables = new Variables();
  let resultService: IResult = null;
  let recordCount = 0;

  try {
    const taskVariables = await camundaService.GetVariables(task);

    // get payload and response value.
    const payload = taskVariables.payloadVariable;
    const response = taskVariables.responseVariable ? taskVariables.responseVariable.response : undefined;

    var validationResult = await kycService.validateGetSummaryBrgy(payload);

    if (validationResult.length === 0) {      
      var result = await kycService.GetSummaryPerAge(payload);
      if (result) {        
        if (payload.pagination.page == 0) {
          if (payload.pagination.count > 0) {
            payload.pagination.count = 0;
            var resultCount = await kycService.GetSummaryPerAge(payload);
            recordCount = resultCount.length;
          }
          else recordCount = result.length;
        }

        resultService = utilResponsePayloadSuccess(result, result.length, recordCount);
        log.info("🔥 getSummaryPerAge success result : %o", JSON.stringify(resultService.value));        
      } else {
        resultService = utilResponsePayloadSystemError("Failed to get summary");
        log.error("🔥 getSummaryPerAge success result : %o", JSON.stringify(resultService.value));        
      }
    } else {
      resultService = utilResponsePayloadInvalidParameter("Invalid payload");
      log.error("🔥 getSummaryPerAge success result : %o", JSON.stringify(resultService.value));      
    }
  } catch (error) {
    console.log(error);
    resultService = utilResponsePayloadSystemError(error);    
    log.error("🔥 getSummaryPerAge success result : %o", JSON.stringify(resultService.value));      
  }

  setTypedVariable(variables, resultService.value);  

  variables.set("status", resultService.status);

  taskService.complete(task, variables);
}

async function getSummaryPerEmploymentStatus({ task, taskService }) {
  const variables = new Variables();
  let resultService: IResult = null;
  let recordCount = 0;

  try {
    const taskVariables = await camundaService.GetVariables(task);

    // get payload and response value.
    const payload = taskVariables.payloadVariable;
    const response = taskVariables.responseVariable ? taskVariables.responseVariable.response : undefined;

    var validationResult = await kycService.validateGetSummaryBrgy(payload);

    if (validationResult.length === 0) {      
      var result = await kycService.GetSummaryPerEmploymentStatus(payload);
      if (result) {        
        if (payload.pagination.page == 0) {
          if (payload.pagination.count > 0) {
            payload.pagination.count = 0;
            var resultCount = await kycService.GetSummaryPerEmploymentStatus(payload);
            recordCount = resultCount.length;
          }
          else recordCount = result.length;
        }

        resultService = utilResponsePayloadSuccess(result, result.length, recordCount);
        log.info("🔥 getSummaryPerEmploymentStatus success result : %o", JSON.stringify(resultService.value));        
      } else {
        resultService = utilResponsePayloadSystemError("Failed to get summary");
        log.error("🔥 getSummaryPerEmploymentStatus success result : %o", JSON.stringify(resultService.value));        
      }
    } else {
      resultService = utilResponsePayloadInvalidParameter("Invalid payload");
      log.error("🔥 getSummaryPerEmploymentStatus success result : %o", JSON.stringify(resultService.value));      
    }
  } catch (error) {
    console.log(error);
    resultService = utilResponsePayloadSystemError(error);    
    log.error("🔥 getSummaryPerEmploymentStatus success result : %o", JSON.stringify(resultService.value));      
  }

  setTypedVariable(variables, resultService.value);  

  variables.set("status", resultService.status);

  taskService.complete(task, variables);
}

async function getSummarySeniorCitizenPerBrgy({ task, taskService }) {
  const variables = new Variables();
  let resultService: IResult = null;
  let recordCount = 0;

  try {
    const taskVariables = await camundaService.GetVariables(task);

    // get payload and response value.
    const payload = taskVariables.payloadVariable;
    const response = taskVariables.responseVariable ? taskVariables.responseVariable.response : undefined;

    var validationResult = await kycService.validateGetSummaryBrgy(payload);

    if (validationResult.length === 0) {      
      var result = await kycService.GetSummarySeniorCitizenPerBrgy(payload);
      if (result) {        
        if (payload.pagination.page == 0) {
          if (payload.pagination.count > 0) {
            payload.pagination.count = 0;
            var resultCount = await kycService.GetSummarySeniorCitizenPerBrgy(payload);
            recordCount = resultCount.length;
          }
          else recordCount = result.length;
        }

        resultService = utilResponsePayloadSuccess(result, result.length, recordCount);
        log.info("🔥 getSummarySeniorCitizenPerBrgy success result : %o", JSON.stringify(resultService.value));        
      } else {
        resultService = utilResponsePayloadSystemError("Failed to get summary");
        log.error("🔥 getSummarySeniorCitizenPerBrgy success result : %o", JSON.stringify(resultService.value));        
      }
    } else {
      resultService = utilResponsePayloadInvalidParameter("Invalid payload");
      log.error("🔥 getSummarySeniorCitizenPerBrgy success result : %o", JSON.stringify(resultService.value));      
    }
  } catch (error) {
    console.log(error);
    resultService = utilResponsePayloadSystemError(error);    
    log.error("🔥 getSummarySeniorCitizenPerBrgy success result : %o", JSON.stringify(resultService.value));      
  }

  setTypedVariable(variables, resultService.value);  

  variables.set("status", resultService.status);

  taskService.complete(task, variables);
}