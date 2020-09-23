import { RESPONSE_CODE } from "./Constants";
import { ValueTransformer } from "typeorm";
import AWS from "aws-sdk";
import moment from "moment";
import axios from "axios";
import { Container } from "typedi";
import client from "cloud-config-client";
import { SERVICE, CONFIG } from "../helpers/Constants";


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

export function uploadFile(content: string, fileName: string, isAllowOverWrite: Boolean, type: "AWSS3" | "fileService"): Promise<IResult> {
  return new Promise((resolve, reject) => {
    const cloudConfig: client.Config = Container.get(SERVICE.CLOUD_CONFIG);
    const result: IResult = {
      status: "failed",
    };
    if (type === "fileService") {
      // setting the header
      const headers = {
        headers: {
          accesskey: cloudConfig.get(CONFIG.FILE.ACCESS_KEY),
          secret: cloudConfig.get(CONFIG.FILE.ACCESS_SECRET),
        },
      };
      // setting the body
      const payload = {
        bucket: cloudConfig.get(CONFIG.FILE.BUCKET),
        key: cloudConfig.get(CONFIG.FILE.FOLDER) + "/" + fileName,
        allowOverWrite: isAllowOverWrite,
        content: content,
      };
      const startTime = moment();
      const URL = `${cloudConfig.get(CONFIG.FILE.DOMAIN)}/file/create`;
      axios
        .post(URL, payload, headers)
        .then((a) => {
          result.value = a.data;
          resolve(result);
        })
        .catch((err) => {
          result.value = {
            responseCode: RESPONSE_CODE.SYSTEM_ERROR.CODE,
            responseMessage: RESPONSE_CODE.SYSTEM_ERROR.MESSAGE,
            totalCount: 0,
            responseCount: 0,
            response: [err.data],
          };
          reject(err.data);
        });

      const endTime = moment();
      const duration = moment.duration(endTime.diff(startTime)).asMilliseconds();
      console.log(`File uploaded successfully. ${cloudConfig.get(CONFIG.FILE.FOLDER) + "/" + fileName} ${duration}ms`);
    } else if (type === "AWSS3") {
      const cloudConfig: client.Config = Container.get(SERVICE.CLOUD_CONFIG);
      const s3 = new AWS.S3({
        accessKeyId: cloudConfig.get(CONFIG.FILE.ACCESS_KEY),
        secretAccessKey: cloudConfig.get(CONFIG.FILE.ACCESS_SECRET),
      });
      const startTime = moment();
      // Read content from the file

      // Setting up FILE upload parameters
      const params = {
        Bucket: cloudConfig.get(CONFIG.FILE.BUCKET),
        Key: cloudConfig.get(CONFIG.FILE.FOLDER) + "/" + fileName, // File name you want to save as in FILE
        Body: content,
      };

      // Uploading files to the bucket
      s3.upload(params, function (err, data) {
        if (err) {
          result.value = {
            responseCode: RESPONSE_CODE.SYSTEM_ERROR.CODE,
            responseMessage: RESPONSE_CODE.SYSTEM_ERROR.MESSAGE,
            totalCount: 0,
            responseCount: 0,
            response: [err],
          };
          return reject(result);
        }

        const endTime = moment();
        const duration = moment.duration(endTime.diff(startTime)).asMilliseconds();
        console.log(`File uploaded successfully. ${data.Location} ${duration}ms`);

        result.value = {
          responseCode: RESPONSE_CODE.SUCCESS.CODE,
          responseMessage: RESPONSE_CODE.SUCCESS.MESSAGE,
          totalCount: 0,
          responseCount: 1,
          response: [data.Body.toString()],
        };
        return resolve(result);
      });
    }
  });
}

export function getFile(fileName: string, type: "AWSS3" | "fileService"): Promise<IResult> {
  return new Promise((resolve, reject) => {
    const cloudConfig: client.Config = Container.get(SERVICE.CLOUD_CONFIG);
    const result: IResult = {
      status: "failed",
    };
    if (type === "fileService") {
      // setting the header
      const headers = {
        headers: {
          accesskey: cloudConfig.get(CONFIG.FILE.ACCESS_KEY),
          secret: cloudConfig.get(CONFIG.FILE.ACCESS_SECRET),
        },
      };
      const startTime = moment();
      const URL = `${cloudConfig.get(CONFIG.FILE.DOMAIN)}/file?bucket=${cloudConfig.get(CONFIG.FILE.BUCKET)}&key=${
        cloudConfig.get(CONFIG.FILE.FOLDER) + "/" + fileName
      }`;
      axios
        .get(URL, headers)
        .then((a) => {
          result.value = a.data;
          resolve(result);
        })
        .catch((err) => {
          result.value = {
            responseCode: RESPONSE_CODE.SYSTEM_ERROR.CODE,
            responseMessage: RESPONSE_CODE.SYSTEM_ERROR.MESSAGE,
            totalCount: 0,
            responseCount: 0,
            response: [err.data],
          };
          reject(err.data);
        });
      const endTime = moment();
      const duration = moment.duration(endTime.diff(startTime)).asMilliseconds();
      console.log(`Getting object success. ${duration}ms`);
    } else if (type === "AWSS3") {
      const s3 = new AWS.S3({
        accessKeyId: cloudConfig.get(CONFIG.FILE.ACCESS_KEY),
        secretAccessKey: cloudConfig.get(CONFIG.FILE.ACCESS_SECRET),
      });
      const startTime = moment();
      // Read content from the file

      // Setting up FILE upload parameters
      var getParams = {
        Bucket: cloudConfig.get(CONFIG.FILE.BUCKET), // your bucket name,
        Key: cloudConfig.get(CONFIG.FILE.FOLDER) + "/" + fileName, // path to the object you're looking for
      };
      // Uploading files to the bucket
      s3.getObject(getParams, function (err, data) {
        // Handle any error and exit
        if (err) {
          result.value = {
            responseCode: RESPONSE_CODE.SYSTEM_ERROR.CODE,
            responseMessage: RESPONSE_CODE.SYSTEM_ERROR.MESSAGE,
            totalCount: 0,
            responseCount: 0,
            response: [err],
          };
          return reject(result);
        }

        // Convert body from a Buffer to base 64
        const endTime = moment();
        const duration = moment.duration(endTime.diff(startTime)).asMilliseconds();
        //const base64Data = data.Body.toString("base64");
        console.log(`Getting object success. ${duration}ms`);
        // saving base64 to image file.
        result.value = {
          responseCode: RESPONSE_CODE.SUCCESS.CODE,
          responseMessage: RESPONSE_CODE.SUCCESS.MESSAGE,
          totalCount: 0,
          responseCount: 1,
          response: [data.Body.toString()],
        };
        return resolve(result);
      });
    }
  });
}

export function deleteFile(fileName: string, type: "AWSS3" | "fileService"): Promise<IResult> {
  return new Promise((resolve, reject) => {
    const cloudConfig: client.Config = Container.get(SERVICE.CLOUD_CONFIG);
    const result: IResult = {
      status: "failed",
    };
    if (type === "fileService") {
      // setting the header
      const config = {
        headers: {
          accesskey: cloudConfig.get(CONFIG.FILE.ACCESS_KEY),
          secret: cloudConfig.get(CONFIG.FILE.ACCESS_SECRET),
        },
        data: {
          bucket: cloudConfig.get(CONFIG.FILE.BUCKET),
          key: cloudConfig.get(CONFIG.FILE.FOLDER) + "/" + fileName,
        },
      };

      const startTime = moment();
      const URL = `${cloudConfig.get(CONFIG.FILE.DOMAIN)}/file`;

      axios
        .delete(URL, config)
        .then((a) => {
          result.value = a.data;
          resolve(result);
        })
        .catch((err) => {
          result.value = {
            responseCode: RESPONSE_CODE.SYSTEM_ERROR.CODE,
            responseMessage: RESPONSE_CODE.SYSTEM_ERROR.MESSAGE,
            totalCount: 0,
            responseCount: 0,
            response: [err.data],
          };
          reject(err.data);
        });
      const endTime = moment();
      const duration = moment.duration(endTime.diff(startTime)).asMilliseconds();

      console.log(`Delete object success. ${duration}ms`);
    } else if (type === "AWSS3") {
      const s3 = new AWS.S3({
        accessKeyId: cloudConfig.get(CONFIG.FILE.ACCESS_KEY),
        secretAccessKey: cloudConfig.get(CONFIG.FILE.ACCESS_SECRET),
      });
      const startTime = moment();
      // Read content from the file

      // Setting up FILE upload parameters
      var getParams = {
        Bucket: cloudConfig.get(CONFIG.FILE.BUCKET), // your bucket name,
        Key: cloudConfig.get(CONFIG.FILE.FOLDER) + "/" + fileName, // path to the object you're looking for
      };
      // Uploading files to the bucket
      return s3.deleteObject(getParams, function (err, data) {
        // Handle any error and exit
        if (err) {
          result.value = {
            responseCode: RESPONSE_CODE.SYSTEM_ERROR.CODE,
            responseMessage: RESPONSE_CODE.SYSTEM_ERROR.MESSAGE,
            totalCount: 0,
            responseCount: 0,
            response: [err],
          };
          return reject(result);
        }

        // Convert body from a Buffer to base 64
        const endTime = moment();
        const duration = moment.duration(endTime.diff(startTime)).asMilliseconds();
        const base64Data = data;
        console.log(`Delete object success. ${duration}ms`);
        // saving base64 to image file.
        result.value = {
          responseCode: RESPONSE_CODE.SUCCESS.CODE,
          responseMessage: RESPONSE_CODE.SUCCESS.MESSAGE,
          totalCount: 0,
          responseCount: 1,
          response: [],
        };
        return resolve(result);
      });
    }
  });
}
