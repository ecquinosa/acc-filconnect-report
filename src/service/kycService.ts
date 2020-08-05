import { Service, Container } from "typedi";
import { validate, ValidationError } from "class-validator";
import { getConnection } from "typeorm"; // to get the configure db connection.
import { KycSearchCitizen } from "../entity/kycSearchCitizen";
import { exampleCreateResponseVM } from "../viewmodel/example/exampleCreateResponseVM";
import { RESPONSE_CODE, STATUS } from "../helpers/Constants";
import { paginationVM } from "../viewmodel/base/baseVM";
import { IResult, utilResponsePayloadSuccess, utilResponsePayloadNoData, utilResponsePayloadInvalidParameter, utilResponsePayloadSystemError } from "../helpers/Utility";
import ExcelService, { IExcelService } from "./excelService";
import fileService from "./fileService";

import fs from 'fs';

export interface IKycService {
  SearchCitizen(payload): Promise<IResult>;
  getFile(payload): Promise<IResult>;
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

    if (payload.payload.ageFrom != undefined && payload.payload.ageFrom != 0) {
      bdateToByage = dateFormat(
        new Date(
          now.getFullYear() - payload.payload.ageFrom,
          now.getMonth(),
          now.getDate()
        ),
        "yyyy-mm-dd"
      );
    }

    if (payload.payload.ageTo != undefined && payload.payload.ageTo != 0) {
      bdateFromByage = dateFormat(
        new Date(now.getFullYear() - payload.payload.ageTo, 1, 1),
        "yyyy-mm-dd"
      );
    }

    if (
      payload.payload.birthDateFrom != "" &&
      payload.payload.birthDateFrom != undefined &&
      payload.payload.birthDateTo != "" &&
      payload.payload.birthDateTo != undefined
    ) {
      bdateFrom = payload.payload.birthDateFrom;
      bdateTo = payload.payload.birthDateTo;
    }

    var query = "SELECT memberId, userProfileId, institutionId, lastName, firstName, middleName, suffix, gender, \
    civilStatusId, civilStatus, birthDate, birthDay, birthCityId, birthCity, birthProvinceId, birthProvince, noOfChildren,  \
    employmentStatusId, employmentStatus, isRegisteredVoter, isPwd, isDependent, presentRoomFloorUnitBldg, \
    presentHouseLotBlock, presentStreetname, presentSubdivision, presentBarangayId, presentBarangay, \
    presentCityId, presentCity, presentProvinceId,presentProvince,presentPostal,presentDistrictId, \
    presentDistrict FROM KycSearchCitizen Where 1=1"

    if (payload.payload.institutionId != "" && payload.payload.institutionId != undefined) {
      query = query.concat(" AND institutionId like '%", payload.payload.institutionId, "%' ");
    }

    if (payload.payload.userProfileId != "" && payload.payload.userProfileId != undefined) {
      query = query.concat(" AND userProfileId like '%", payload.payload.userProfileId, "%' ");
    }

    if (payload.payload.firstName != "" && payload.payload.firstName != undefined) {
      query = query.concat(" AND firstName like '%", payload.payload.firstName, "%' ");
    }

    if (payload.payload.lastName != "" && payload.payload.lastName != undefined) {
      query = query.concat(" AND lastName like '%", payload.payload.lastName, "%' ");
    }

    if (payload.payload.middleName != "" && payload.payload.middleName != undefined) {
      query = query.concat(" AND middleName like '%", payload.payload.middleName, "%' ");
    }

    if (payload.payload.civilStatus != "" && payload.payload.civilStatus != undefined) {
      query = query.concat(" AND civilStatus like '%", payload.payload.civilStatus, "%' ");
    }

    if (payload.payload.gender != "" && payload.payload.gender != undefined) {
      query = query.concat(" AND gender like '%", payload.payload.gender, "%' ");
    }

    if (payload.payload.isPwd != "" && payload.payload.isPwd != undefined) {
      query = query.concat(" AND isPwd = '", payload.payload.isPwd, "' ");
    }

    if (payload.payload.isDependent != "" && payload.payload.isDependent != undefined) {
      query = query.concat(" AND isDependent ='", payload.payload.isDependent, "' ");
    }

    if (payload.payload.birthCity != "" && payload.payload.birthCity != undefined) {
      query = query.concat(" AND birthCity like '%", payload.payload.birthCity, "%' ");
    }

    if (payload.payload.birthProvince != "" && payload.payload.birthProvince != undefined) {
      query = query.concat(" AND birthProvince like '%", payload.payload.birthProvince, "%' ");
    }

    if (payload.payload.employmentStatus != "" && payload.payload.employmentStatus != undefined) {
      query = query.concat(" AND employmentStatus like '%", payload.payload.employmentStatus, "%' ");
    }

    if (payload.payload.presentRoomFloorUnitBldg != "" && payload.payload.presentRoomFloorUnitBldg != undefined) {
      query = query.concat(" AND presentRoomFloorUnitBldg like '%", payload.payload.presentRoomFloorUnitBldg, "%' ");
    }

    if (payload.payload.presentHouseLotBlock != "" && payload.payload.presentHouseLotBlock != undefined) {
      query = query.concat(" AND presentHouseLotBlock like '%", payload.payload.presentHouseLotBlock, "%' ");
    }

    if (payload.payload.presentStreetname != "" && payload.payload.presentStreetname != undefined) {
      query = query.concat(" AND presentStreetname like '%", payload.payload.presentStreetname, "%' ");
    }

    if (payload.payload.presentSubdivision != "" && payload.payload.presentSubdivision != undefined) {
      query = query.concat(" AND presentSubdivision like '%", payload.payload.presentSubdivision, "%' ");
    }

    if (payload.payload.presentBarangay != "" && payload.payload.presentBarangay != undefined) {
      query = query.concat(" AND presentBarangay like '%", payload.payload.presentBarangay, "%' ");
    }

    if (payload.payload.presentCity != "" && payload.payload.presentCity != undefined) {
      query = query.concat(" AND presentCity like '%", payload.payload.presentCity, "%' ");
    }

    if (payload.payload.presentProvince != "" && payload.payload.presentProvince != undefined) {
      query = query.concat(" AND presentProvince like '%", payload.payload.presentProvince, "%' ");
    }

    if (
      payload.payload.birthDateFrom != "" &&
      payload.payload.birthDateFrom != undefined &&
      payload.payload.birthDateTo != "" &&
      payload.payload.birthDateTo != undefined
    ) {
      query = query.concat(" AND (birthDay >='", dateFormat(payload.payload.birthDateFrom, "mmddhhMM").toString().slice(0, 4), "'  AND birthDay <='", dateFormat(payload.payload.birthDateTo, "mmddhhMM").toString().slice(0, 4), "') ");

    }

    if (payload.payload.ageTo != undefined && payload.payload.ageTo != 0) {
      query = query.concat(" AND (birthDate BETWEEN '", bdateFromByage, "'  AND '", bdateToByage, "') ");
    }

    // if (payload.pagination.count > 0) {
    //   query = query.concat("  ORDER BY m.id ASC ");
    //   query = query.concat(" OFFSET ", (payload.pagination.page * payload.pagination.count).toString(), " ROWS ");
    //   query = query.concat(" FETCH NEXT ", (payload.pagination.count).toString(), " ROWS ONLY ");
    // }

    var repoResponse = await searchCitizenRepository.query(query);

    if (repoResponse.length > 0) {
      console.log(repoResponse.length);
      const es = new ExcelService();
      const saveToXls = await es.SaveToXls(repoResponse, repoResponse.length);
      if (saveToXls.status == "success") {
        const fs = new fileService();
        
        var fsResult = await fs.uploadFile({"fileName": saveToXls.value.response});

        return await fsResult;        
      }
      else {        
        result = utilResponsePayloadNoData();
      }

      return result;
    }
  }

  public async getFile(entity) {
    const fs = new fileService();
    return await fs.getFile({"location": entity.payload.fileName});    
  }
}
