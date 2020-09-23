import { Service, Container } from "typedi";
import { validate, ValidationError } from "class-validator";
import { getConnection } from "typeorm"; // to get the configure db connection.
import { KycSearchCitizen } from "../entity/kycSearchCitizen";
import { RESPONSE_CODE, STATUS, TABLE_UUID } from "../helpers/Constants";
import { paginationVM } from "../viewmodel/base/baseVM";
import { IResult, utilResponsePayloadSuccess, utilResponsePayloadNoData, utilResponsePayloadInvalidParameter, utilResponsePayloadSystemError, utilResponsePayloadSuccessNoParam, getFile, deleteFile } from "../helpers/Utility";
import ExcelService, { IExcelService } from "./excelService";
import PDFService, { IPDFService } from "./pdfService";
import fileService from "./fileService";
import { uploadFile, randomIntFromInterval } from "../helpers/Utility";

import fs, { unlink } from 'fs';

export interface IKycService {  
  createCitizen(memberId, payload): Promise<IResult>;
  SearchCitizen(payload): Promise<IResult>;
  SearchCitizenv2(payload): Promise<IResult>;
  getFilev1(payload): Promise<IResult>;
  getFilev2(payload): Promise<IResult>;
  deleteFilev1(payload): Promise<IResult>;
  deleteFilev2(payload): Promise<IResult>;  
}

// Service layer where to put all the business logic computation % etc.
@Service()
export default class KycService implements IKycService {

  public async createCitizen(memberId, entity): Promise<IResult> {
    let memberEntity: KycSearchCitizen = entity;
    var dateFormat = require('dateformat');
    const conn = getConnection();
    var memberRepository = await conn.getRepository(KycSearchCitizen);

    var record = await memberRepository.createQueryBuilder("KycSearchCitizen")      
      .where("firstName = :firstName", { firstName: entity.firstName })
      .andWhere("middleName = :middleName", { middleName: entity.middleName })
      .andWhere("lastName = :lastName", { lastName: entity.lastName })
      .getOne();

    if (!record) {
      var dob = new Date(entity.birthDate);
      dob.setHours(0, 0, 0, 0);
      memberEntity.birthDate = dob;
      memberEntity.birthDay = dateFormat(dob, "mmddhhMM").toString().slice(0, 4);

      var age = await this.calculate_age(dob);
      var ageBracket = '60+';
      if (age < 19) ageBracket = '0-18';
      if (age > 18 && age < 41) ageBracket = '19-40';
      if (age > 40 && age < 61) ageBracket = '41-60';

      memberEntity.memberId = memberId;
      memberEntity.userProfileId = entity.userProfileId;
      memberEntity.institutionId = entity.institutionId;
      memberEntity.lastName = entity.lastName;
      memberEntity.firstName = entity.firstName;
      memberEntity.middleName = entity.middleName;
      memberEntity.suffix = entity.suffix;
      memberEntity.gender = entity.gender;
      memberEntity.age = age;
      memberEntity.ageBracket = ageBracket;
      memberEntity.civilStatusId = entity.civilStatusId;
      memberEntity.civilStatus = entity.civilStatus;
      memberEntity.birthCityId = entity.birthCityId;
      memberEntity.birthCity = entity.birthCity;
      memberEntity.birthProvinceId = entity.birthProvinceId;
      memberEntity.birthProvince = entity.birthProvince;
      memberEntity.noOfChildren = entity.noOfChildren;
      memberEntity.employmentStatusId = entity.employmentStatusId;
      memberEntity.employmentStatus = entity.employmentStatus;
      memberEntity.isRegisteredVoter = entity.isRegisteredVoter;
      memberEntity.isPwd = entity.isPwd;
      memberEntity.isDependent = entity.isDependent;

      if (entity.payload.address != undefined) {
        memberEntity.presentRoomFloorUnitBldg = entity.presentRoomFloorUnitBldg;
        memberEntity.presentHouseLotBlock = entity.presentHouseLotBlock;
        memberEntity.presentStreetname = entity.presentStreetname;
        memberEntity.presentSubdivision = entity.presentSubdivision;
        memberEntity.presentBarangayId = entity.presentBarangayId;
        memberEntity.presentBarangay = entity.presentBarangay;
        memberEntity.presentCityId = entity.presentCityId;
        memberEntity.presentCity = entity.presentCity;
        memberEntity.presentProvinceId = entity.presentProvinceId;
        memberEntity.presentProvince = entity.presentProvince;
        memberEntity.presentPostal = entity.presentPostal;
        memberEntity.presentDistrictId = entity.presentDistrictId;
        memberEntity.presentDistrict = entity.presentDistrict;
      }

      if (entity.payload.contact != undefined) {
        var resultContactInfo1 = entity.payload.contact;
        var telephoneNos = resultContactInfo1.find(({ type }) => type === TABLE_UUID.telephoneNos);
        var mobileNos = resultContactInfo1.find(({ type }) => type === TABLE_UUID.mobileNos);
        var email = resultContactInfo1.find(({ type }) => type === TABLE_UUID.email);

        memberEntity.telephoneNos = telephoneNos;
        memberEntity.mobileNos = mobileNos;
        memberEntity.email = email;
      }      

      var saveResult = await memberRepository.save(memberEntity);

      if(saveResult) utilResponsePayloadSuccess(saveResult, 0, 0);      
      else return utilResponsePayloadSystemError("Failed to add report kyc citizen");      
    }
    // else {
    //   return await this.update(entity);
    // }
  }

  // public async update(entity) {

  //   const conn = getConnection();
  //   var entityRepository = await conn.getRepository(KycSearchCitizen);

  //   var dateFormat = require('dateformat');

  //   var dob = new Date(entity.birthDate);
  //   dob.setHours(0, 0, 0, 0);

  //   var query = "update KycSearchCitizen set "
  //   query = query.concat(" institutionId = '", entity.institutionId, "',");
  //   query = query.concat(" gender = '", entity.gender, "',");
  //   query = query.concat(" birthDate = '", dob.toISOString().slice(0, 10), "',");
  //   query = query.concat(" presentCity = '", entity.presentCity, "',");
  //   query = query.concat(" presentProvince = '", entity.presentProvince, "',");

  //   query = query.concat(" birthDay = '", (await this.getBirthDayFormat(dob)).toString(), "',");

  //   query = query.concat(" age = CAST(DATEDIFF(dy,  '", dob.toISOString().slice(0, 10), "', GETD ATE())/365.25 AS int),");
  //   query = query.concat(" ageBracket = case \
  //   when CAST(DATEDIFF(dy,  '", dob.toISOString().slice(0, 10), "', GETDATE())/365.25 AS int)<=18 THEN '0-18' \
  //   WHEN CAST(DATEDIFF(dy,  '", dob.toISOString().slice(0, 10), "', GETDATE())/365.25 AS int) BETWEEN 19 AND 40 THEN '19-40' \
  //   WHEN CAST(DATEDIFF(dy,  '", dob.toISOString().slice(0, 10), "', GETDATE())/365.25 AS int) BETWEEN 41 AND 60 THEN '41-60' \
  //   ELSE '60+' END,");

  //   query = query.concat(" updated = GETDATE() ");

  //   query = query.concat(" WHERE (select id from Member where uuid = '", entity.memberId, "') = memberId ");

  //   var result = await entityRepository.query(query);

  //   var record = await entityRepository.createQueryBuilder("KycSearchCitizen")
  //     .select([
  //       "member.uuid",
  //       "KycSearchCitizen.age",
  //       "KycSearchCitizen.ageBracket"
  //     ])
  //     .innerJoin("KycSearchCitizen.member", "member")
  //     .where("member.uuid = :memberId", { memberId: entity.memberId })
  //     .getOne();

  //   return await record;
  // }

  async getBirthDayFormat(obj: Date) {
    var dobMonth = obj.getUTCMonth() + 1;
    var dobDay = obj.getUTCDate();
    var dobMonthStr = dobMonth.toString();
    var dobDayStr = dobDay.toString();
    if (dobMonth < 10) { dobMonthStr = '0' + dobMonth.toString() }
    if (dobDay < 10) { dobDayStr = '0' + dobDay.toString() }
    return await dobMonthStr + dobDayStr;
  }


  public async calculate_age(dob) {
    var dt = new Date(dob);

    let timeDiff = Math.abs(Date.now() - dt.getTime());
    let age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);

    return age;
  }

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

      if (xlsx != null) {
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

  public async SearchCitizenv2(payload: any): Promise<IResult> {
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

    var repoResponse = await searchCitizenRepository.query(query);

    if (repoResponse.length > 0) {

      var xlsx = payload.outputFile.find(({ ext }) => ext === "xlsx");
      var pdf = payload.outputFile.find(({ ext }) => ext === "pdf");

      var files = [];
      const fs = new fileService();

      if (xlsx != null) {
        const es = new ExcelService();
        const saveToXls = await es.SaveToXls(repoResponse, repoResponse.length);
        if (saveToXls.status == "success") {

          var xlsFileName = saveToXls.value.response.toString().replace("./", "");                    

          const uploadResult: IResult = await uploadFile(await fs.base64_encode(saveToXls.value.response.toString()), xlsFileName, false, "fileService");
          if (uploadResult.value.responseCode === RESPONSE_CODE.SUCCESS.CODE) {
            files.push({ ext: xlsFileName });
            unlink(saveToXls.value.response.toString(), (err) => { if (err) { console.log("🔥 file deletion error: %o", err); } })
          } 
          // else {
          //   result.status = "failed";
          //   result.value = uploadResult.value;
          // }
        }
      }

      if (pdf != null) {
        const ps = new PDFService();
        const saveToPdf = await ps.SaveToPdf(repoResponse, repoResponse.length, false);
        if (saveToPdf.status == "success") 
        {
          var pdfFileName = saveToPdf.value.response.toString().replace("./", "");                    

          const uploadResult: IResult = await uploadFile(await fs.base64_encode(saveToPdf.value.response.toString()), pdfFileName, false, "fileService");
          if (uploadResult.value.responseCode === RESPONSE_CODE.SUCCESS.CODE) 
          {
            files.push({ ext: pdfFileName });
            unlink(saveToPdf.value.response.toString(), (err) => { if (err) { console.log("🔥 file deletion error: %o", err); } })
          }
          
        }        
      }

      if (files.length > 0) result = utilResponsePayloadSuccess(files, 0, 0);
      else result = utilResponsePayloadSystemError("No xlsx or pdf generated");

      return result;
    }
  }

  public async getFilev1(payload) {
    const fs = new fileService();
    var response = await fs.getFile({ "location": payload.fileName });
    //console.log(response);
    return await response;
  }

  public async getFilev2(payload) {
    const fs = new fileService();

    const getResult: IResult = await getFile(payload.fileName, "fileService");
    if (getResult.value.responseCode === RESPONSE_CODE.SUCCESS.CODE) {
      var ext = payload.fileName.substring(payload.fileName.lastIndexOf('.') + 1);
      var response = {
        ext: ext,
        base64: getResult.value.response[0].toString()
      };

      return await utilResponsePayloadSuccess(response, 0, 0);
    } else return utilResponsePayloadSystemError(getResult.value.responseMessage);
  }

  public async deleteFilev1(payload) {
    const fs = new fileService();
    var response = await fs.deleteFile(payload);
    return await response;
  }

  public async deleteFilev2(payload) {
    const fs = new fileService();
  
    var responses = [];    

    for (var f in payload.files) {
      const deleteResult: IResult = await deleteFile(payload.files[f].key, "fileService");            
      if (deleteResult.value.responseCode == RESPONSE_CODE.SUCCESS.CODE) {
        responses.push(payload.files[f].key + ' is deleted.');
      } else responses.push('Failed to delete ' + payload.files[f].key + '. ' + deleteResult.value.responseMessage);
    }

    return await utilResponsePayloadSuccess(responses, 0, 0);
  }

}
