export const SERVICE = {
  LOGGER: "logger",
  CLOUD_CONFIG: "CloudConfig",
  CAMUNDA: "camunda",
  CAMUNDA_SERVICE: "camundaService",
  REPORT: "reportService",
  KYC: "reportKycService",
};

export const ROUTE = {  
  REPORT: {
    MAIN: "/report",
    KYC_SEARCH_CITIZEN: "/kycSearchCitizen",
    GET_FILE: "/getFile",
  },
};

export const ORCHESTRATION = {
  TOPIC: {
    REPORT: {
      KYC_SEARCH_CITIZEN: "reportKycSearchCitizen",
      GET_FILE: "reportGetFile"
    },
  },
  PROCESS_DEFINITION: {
    REPORT: {
      KYC_SEARCH_CITIZEN: "reportKycSearchCitizen",
      GET_FILE: "reportGetFile"
    },
  },
  VARIABLE: {
    PAYLOAD: "payload",
    HEADERS: "headers",
    RESPONSE: "response",
    STATUS: "status",
  },
};

export const CONFIG = {
  APP: {
    NAME: "spring.application.name",
  },
  SERVER: {
    PORT: "server.port",
  },
  CAMUNDA: {
    HOST: "camunda.host",
  },
  EUREKA: {
    HOST: "eureka.host",
    PORT: "eureka.port",
  },
  DB: {
    TYPE: "db.type",
    HOST: "db.host",
    PORT: "db.port",
    NAME: "db.name",
    USER: "db.user",
    PASSWORD: "db.password",
  },
  S3: {
    BUCKET: "s3.bucketname",
    ACCESSKEYID: "s3.accesskeyid",
    SECRETACCESSKEY: "s3.secretaccesskey",
    FOLDER: "s3.folder"
  },
};

export const RESPONSE_CODE = {
  SYSTEM_ERROR: {
    MESSAGE: "System Error",
    CODE: "0500",
  },
  SUCCESS: {
    MESSAGE: "Success",
    CODE: "0000",
  },
  INVALID_PARAMETER: {
    MESSAGE: "Invalid Parameter",
    CODE: "0001",
  },
  NO_DATA_FOUND: {
    MESSAGE: "No Data Found",
    CODE: "0002",
  },
};

export const STATUS = {
  SUCCESS: "success",
  FAILED: "failed",
  CANCEL: "cancel",
};
