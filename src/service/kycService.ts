import { Service, Container } from "typedi";
import { validate, ValidationError } from "class-validator";
import { getConnection } from "typeorm"; // to get the configure db connection.
import { KycSearchCitizen } from "../entity/kycSearchCitizen";
import { RESPONSE_CODE, STATUS } from "../helpers/Constants";
import { paginationVM } from "../viewmodel/base/baseVM";
import { IResult, utilResponsePayloadSuccess, utilResponsePayloadNoData, utilResponsePayloadInvalidParameter, utilResponsePayloadSystemError, utilResponsePayloadSuccessNoParam } from "../helpers/Utility";
import ExcelService, { IExcelService } from "./excelService";
import PDFService, { IPDFService } from "./pdfService";
import fileService from "./fileService";

import fs from 'fs';

export interface IKycService {
  SearchCitizen(payload): Promise<IResult>;
  getFile(payload): Promise<IResult>;
  deleteFile(payload): Promise<IResult>;
}

// Service layer where to put all the business logic computation % etc.
@Service()
export default class KycService implements IKycService {

  public async SearchCitizen(payload: any): Promise<IResult> {
    let result: IResult = null;

    const conn = getConnection();
    const searchCitizenRepository = await conn.getRepository(KycSearchCitizen);

    var dateFormat = require("dateformat");
    var now = new Date();

    var bdateFrom = "01-01";
    var bdateTo = "12-31";

    var bdateFromByage = "1900-01-01";
    var bdateToByage = dateFormat(now, "yyyy-mm-dd");

    if (payload.ageFrom != undefined && payload.ageFrom != 0) {
      bdateToByage = dateFormat(
        new Date(
          now.getFullYear() - payload.ageFrom,
          now.getMonth(),
          now.getDate()
        ),
        "yyyy-mm-dd"
      );
    }

    if (payload.ageTo != undefined && payload.ageTo != 0) {
      bdateFromByage = dateFormat(
        new Date(now.getFullYear() - payload.ageTo, 1, 1),
        "yyyy-mm-dd"
      );
    }

    if (
      payload.birthDateFrom != "" &&
      payload.birthDateFrom != undefined &&
      payload.birthDateTo != "" &&
      payload.birthDateTo != undefined
    ) {
      bdateFrom = payload.birthDateFrom;
      bdateTo = payload.birthDateTo;
    }

    var query = "SELECT memberId, userProfileId, institutionId, lastName, firstName, middleName, suffix, gender, \
    civilStatusId, civilStatus, birthDate, birthDay, birthCityId, birthCity, birthProvinceId, birthProvince, noOfChildren,  \
    employmentStatusId, employmentStatus, isRegisteredVoter, isPwd, isDependent, presentRoomFloorUnitBldg, \
    presentHouseLotBlock, presentStreetname, presentSubdivision, presentBarangayId, presentBarangay, \
    presentCityId, presentCity, presentProvinceId,presentProvince,presentPostal,presentDistrictId, \
    presentDistrict, mobileNos, telephoneNos, email FROM KycSearchCitizen Where 1=1"

    if (payload.institutionId != "" && payload.institutionId != undefined) {
      query = query.concat(" AND institutionId like '%", payload.institutionId, "%' ");
    }

    if (payload.userProfileId != "" && payload.userProfileId != undefined) {
      query = query.concat(" AND userProfileId like '%", payload.userProfileId, "%' ");
    }

    if (payload.firstName != "" && payload.firstName != undefined) {
      query = query.concat(" AND firstName like '%", payload.firstName, "%' ");
    }

    if (payload.lastName != "" && payload.lastName != undefined) {
      query = query.concat(" AND lastName like '%", payload.lastName, "%' ");
    }

    if (payload.middleName != "" && payload.middleName != undefined) {
      query = query.concat(" AND middleName like '%", payload.middleName, "%' ");
    }

    if (payload.civilStatus != "" && payload.civilStatus != undefined) {
      query = query.concat(" AND civilStatus like '%", payload.civilStatus, "%' ");
    }

    if (payload.gender != "" && payload.gender != undefined) {
      query = query.concat(" AND gender like '%", payload.gender, "%' ");
    }

    if (payload.isPwd != "" && payload.isPwd != undefined) {
      query = query.concat(" AND isPwd = '", payload.isPwd, "' ");
    }

    if (payload.isDependent != "" && payload.isDependent != undefined) {
      query = query.concat(" AND isDependent ='", payload.isDependent, "' ");
    }

    if (payload.noOfChildren != "" && payload.noOfChildren != undefined) {
      query = query.concat(" AND noOfChildren =", payload.noOfChildren, " ");
    }    

    if (payload.birthCity != "" && payload.birthCity != undefined) {
      query = query.concat(" AND birthCity like '%", payload.birthCity, "%' ");
    }

    if (payload.birthProvince != "" && payload.birthProvince != undefined) {
      query = query.concat(" AND birthProvince like '%", payload.birthProvince, "%' ");
    }

    if (payload.employmentStatus != "" && payload.employmentStatus != undefined) {
      query = query.concat(" AND employmentStatus like '%", payload.employmentStatus, "%' ");
    }

    if (payload.presentRoomFloorUnitBldg != "" && payload.presentRoomFloorUnitBldg != undefined) {
      query = query.concat(" AND presentRoomFloorUnitBldg like '%", payload.presentRoomFloorUnitBldg, "%' ");
    }

    if (payload.presentHouseLotBlock != "" && payload.presentHouseLotBlock != undefined) {
      query = query.concat(" AND presentHouseLotBlock like '%", payload.presentHouseLotBlock, "%' ");
    }

    if (payload.presentStreetname != "" && payload.presentStreetname != undefined) {
      query = query.concat(" AND presentStreetname like '%", payload.presentStreetname, "%' ");
    }

    if (payload.presentSubdivision != "" && payload.presentSubdivision != undefined) {
      query = query.concat(" AND presentSubdivision like '%", payload.presentSubdivision, "%' ");
    }

    if (payload.presentBarangay != "" && payload.presentBarangay != undefined) {
      query = query.concat(" AND presentBarangay like '%", payload.presentBarangay, "%' ");
    }

    if (payload.presentCity != "" && payload.presentCity != undefined) {
      query = query.concat(" AND presentCity like '%", payload.presentCity, "%' ");
    }

    if (payload.presentProvince != "" && payload.presentProvince != undefined) {
      query = query.concat(" AND presentProvince like '%", payload.presentProvince, "%' ");
    }

    if (
      payload.birthDateFrom != "" &&
      payload.birthDateFrom != undefined &&
      payload.birthDateTo != "" &&
      payload.birthDateTo != undefined
    ) {
      query = query.concat(" AND (birthDay >='", dateFormat(payload.birthDateFrom, "mmddhhMM").toString().slice(0, 4), "'  AND birthDay <='", dateFormat(payload.birthDateTo, "mmddhhMM").toString().slice(0, 4), "') ");

    }

    if (payload.ageTo != undefined && payload.ageTo != 0) {
      query = query.concat(" AND (birthDate BETWEEN '", bdateFromByage, "'  AND '", bdateToByage, "') ");
    }

    // if (payload.pagination.count > 0) {
    //   query = query.concat("  ORDER BY m.id ASC ");
    //   query = query.concat(" OFFSET ", (payload.pagination.page * payload.pagination.count).toString(), " ROWS ");
    //   query = query.concat(" FETCH NEXT ", (payload.pagination.count).toString(), " ROWS ONLY ");
    // }

    var repoResponse = await searchCitizenRepository.query(query);

    if (repoResponse.length > 0) {

      var xlsx = payload.outputFile.find(({ ext }) => ext === "xlsx");
      var pdf = payload.outputFile.find(({ ext }) => ext === "pdf");           

      var files = [];     

      if (xlsx !=null) {
        const es = new ExcelService();
        const saveToXls = await es.SaveToXls(repoResponse, repoResponse.length);
        if (saveToXls.status == "success") {
          const fs = new fileService();

          var fsResult = await fs.uploadFile({ "fileName": saveToXls.value.response });
          if (fsResult.status == "success") files.push({ ext: fsResult.value.response.toString() });
        }
      }

      if (pdf != null) {
        const ps = new PDFService();
        const saveToPdf = await ps.SaveToPdf(repoResponse, repoResponse.length, true);
        if (saveToPdf.status == "success") files.push({ ext: saveToPdf.value.response.toString() });     
      }

      if (files.length > 0) result = utilResponsePayloadSuccess(files, 0, 0);
      else result = utilResponsePayloadSystemError("No xlsx or pdf generated");     

      return result;
    }
  }

  public async getFile(payload) {
    const fs = new fileService();
    var response = await fs.getFile({ "location": payload.fileName });
    //console.log(response);
    return await response;
  }

  public async deleteFile(payload) {
    const fs = new fileService();
    var response = await fs.deleteFile(payload);    
    return await response;
  }
}
