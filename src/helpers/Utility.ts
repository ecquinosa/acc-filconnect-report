import { RESPONSE_CODE } from "./Constants";
import { ValueTransformer } from "typeorm";

export interface IResult {
  value?: {
    responseCode: string;
    responseMessage: string;
    responseCount: number;
    totalCount: number;
    response: any[];
  };
  status: "success" | "failed" | "cancel";
}

export function utilResponsePayloadSuccessNoParam(): IResult {
  let resp: IResult = {
    status: "success"
  };  
  resp.value = {
    "responseCode": RESPONSE_CODE.SUCCESS.CODE,
    "responseMessage": RESPONSE_CODE.SUCCESS.MESSAGE,
    "responseCount": 0,
    "totalCount": 0,
    "response": []
  };

  return resp;
}

export function utilResponsePayloadSuccess(entity, responseCount: number, totalCount: number): IResult {
  let resp: IResult = {
    status: "success"
  };  
  resp.value = {
    "responseCode": RESPONSE_CODE.SUCCESS.CODE,
    "responseMessage": RESPONSE_CODE.SUCCESS.MESSAGE,
    "responseCount": responseCount,
    "totalCount": totalCount,
    "response": entity
  };

  return resp;
}

export function utilResponsePayloadSystemError(entity): IResult {
  let resp: IResult = {
    status: "failed"
  };  
  resp.value = {
    "responseCode": RESPONSE_CODE.SYSTEM_ERROR.CODE,
    "responseMessage": RESPONSE_CODE.SYSTEM_ERROR.MESSAGE,
    "responseCount": 0,
    "totalCount": 0,
    "response": [entity]
  };

  return resp;
}

export function utilResponsePayloadNoData(): IResult {
  let resp: IResult = {
    status: "success"
  };  
  resp.value = {
    "responseCode": RESPONSE_CODE.NO_DATA_FOUND.CODE,
    "responseMessage": RESPONSE_CODE.NO_DATA_FOUND.MESSAGE,
    "responseCount": 0,
    "totalCount": 0,
    "response": []
  };

  return resp;
}

export function utilResponsePayloadInvalidParameter(entity): IResult {
  let resp: IResult = {
    status: "failed"
  };  
  resp.value = {
    "responseCode": RESPONSE_CODE.INVALID_PARAMETER.CODE,
    "responseMessage": RESPONSE_CODE.INVALID_PARAMETER.MESSAGE,
    "responseCount": 0,
    "totalCount": 0,
    "response": [entity]
  };

  return resp;
}

export function removeBaseEntity(entity) {
  return [
    "id",
    "uuid",
    "version",
    "created",
    "createdBy",
    "updated",
    "updatedBy",
    "userprofile",
  ].forEach((e) => delete entity[e]);
}

export function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}
