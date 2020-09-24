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
    KYC_CREATE_CITIZEN: "/kycCreateCitizen",
    KYC_UPDATE_CITIZEN: "/kycUpdateCitizen",
    KYC_UPDATE_ADDRESS_CITIZEN: "/kycUpdateAddressCitizen",
    KYC_UPDATE_CONTACTINFO_CITIZEN: "/kycUpdateContactInfoCitizen",
    KYC_UPDATE_AGE_CITIZEN: "/kycUpdateAgeCitizen",
    GET_FILE: "/getFile",
    DELETE_FILE: "/deleteFile",
    LIST_FILE: "/listFiles",
    GET_SUMMARY_PER_BRGY: "/getSummaryPerBrgy",
    GET_SUMMARY_PER_AGE: "/getSummaryPerAge",
    GET_SUMMARY_PER_AGE_BRACKET: "/getSummaryPerAgeBracket",
    GET_SUMMARY_PER_EMPLOYMENT_STATUS: "/getSummaryPerEmploymentStatus",
    GET_SUMMARY_SENIORCITIZEN_PER_BRGY: "/getSummarySeniorCitizenPerBrgy",
  },
};

export const ORCHESTRATION = {
  TOPIC: {
    REPORT: {
      KYC_SEARCH_CITIZEN: "reportKycSearchCitizen",
      KYC_CREATE_CITIZEN: "reportKycCreateCitizen",
      KYC_UPDATE_CITIZEN: "reportKycUpdateCitizen",
      KYC_UPDATE_ADDRESS_CITIZEN: "reportKycUpdateAddressCitizen",
      KYC_UPDATE_CONTACTINFO_CITIZEN: "reportKycUpdateContactInfoCitizen",
      KYC_UPDATE_AGE_CITIZEN: "reportKycUpdateAgeCitizen",
      GET_FILE: "reportGetFile",
      DELETE_FILE: "reportDeleteFile",
      LIST_FILE: "reportListFiles",
      GET_SUMMARY_PER_BRGY: "kycGetSummaryPerBrgy",
      GET_SUMMARY_PER_AGE: "kycGetSummaryPerAge",
      GET_SUMMARY_PER_AGE_BRACKET: "kycGetSummaryPerAgeBracket",
      GET_SUMMARY_PER_EMPLOYMENT_STATUS: "kycGetSummaryPerEmploymentStatus",
      GET_SUMMARY_SENIORCITIZEN_PER_BRGY: "kycGetSummarySeniorCitizenPerBrgy",
    },
  },
  PROCESS_DEFINITION: {
    REPORT: {
      KYC_SEARCH_CITIZEN: "reportKycSearchCitizen",
      KYC_CREATE_CITIZEN: "reportKycCreateCitizen",
      KYC_UPDATE_CITIZEN: "reportKycUpdateCitizen",
      KYC_UPDATE_ADDRESS_CITIZEN: "reportKycUpdateAddressCitizen",
      KYC_UPDATE_CONTACTINFO_CITIZEN: "reportKycUpdateContactInfoCitizen",
      KYC_UPDATE_AGE_CITIZEN: "reportKycUpdateAgeCitizen",
      GET_FILE: "reportGetFile",
      DELETE_FILE: "reportDeleteFile",
      LIST_FILE: "reportListFiles",
      GET_SUMMARY_PER_BRGY: "kycGetSummaryPerBrgy",
      GET_SUMMARY_PER_AGE: "kycGetSummaryPerAge",
      GET_SUMMARY_PER_AGE_BRACKET: "kycGetSummaryPerAgeBracket",
      GET_SUMMARY_PER_EMPLOYMENT_STATUS: "kycGetSummaryPerEmploymentStatus",
      GET_SUMMARY_SENIORCITIZEN_PER_BRGY: "kycGetSummarySeniorCitizenPerBrgy",
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
  FILE: {
    BUCKET: "file.bucketname",
    ACCESS_KEY: "file.accesskeyid",
    ACCESS_SECRET: "file.secretaccesskey",
    FOLDER: "file.folder",
    DOMAIN: "file.domain",
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

export const TABLE_UUID = {
  relationshipFather: '1fdfdbee-6eb1-ea11-aa80-0a75e0afb438'.toUpperCase(),
  relationshipMother: '20dfdbee-6eb1-ea11-aa80-0a75e0afb438'.toUpperCase(),
  telephoneNos: 'f56998d0-2bab-ea11-aa80-0a46f5c1402c'.toUpperCase(),
  mobileNos: 'f66998d0-2bab-ea11-aa80-0a46f5c1402c'.toUpperCase(),
  email: '334ee2d8-2bab-ea11-aa80-0a46f5c1402c'.toUpperCase(),
};
