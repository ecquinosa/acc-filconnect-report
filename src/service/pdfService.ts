import { Service, Container } from "typedi";
import { validate, ValidationError } from "class-validator";
import { getConnection } from "typeorm"; // to get the configure db connection.
import { KycSearchCitizen } from "../entity/kycSearchCitizen";
//import { exampleCreateResponseVM } from "../viewmodel/example/exampleCreateResponseVM";
import { RESPONSE_CODE, STATUS } from "../helpers/Constants";
import { IResult, utilResponsePayloadSuccess, utilResponsePayloadNoData, utilResponsePayloadInvalidParameter, utilResponsePayloadSystemError, utilResponsePayloadSuccessNoParam, randomIntFromInterval } from "../helpers/Utility";

export interface IPDFService {
  SaveToPdf(entity, totalRecords): Promise<IResult>;
}

// Service layer where to put all the business logic computation % etc.
@Service()
export default class PDFService implements IPDFService {

  public async SaveToPdf(entity: any, totalRecords: number): Promise<IResult> {  
    let result: IResult = null;

    try {
      const ExcelJS = require('exceljs');
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('data');

      worksheet.columns = [        
        { header: 'institutionId', key: 'institutionId', width: 15 },
        { header: 'lastName', key: 'lastName', width: 15 },
        { header: 'firstName', key: 'firstName', width: 15 },
        { header: 'middleName', key: 'middleName', width: 15 },
        { header: 'suffix', key: 'suffix', width: 10 },
        { header: 'gender', key: 'gender', width: 10 },        
        { header: 'civilStatus', key: 'civilStatus', width: 15 },
        { header: 'birthDate', key: 'birthDate', width: 15 },        
        { header: 'birthCity', key: 'birthCity', width: 20 },        
        { header: 'birthProvince', key: 'birthProvince', width: 20 },
        { header: 'noOfChildren', key: 'noOfChildren', width: 10 },        
        { header: 'employmentStatus', key: 'employmentStatus', width: 20 },
        { header: 'isRegisteredVoter', key: 'isRegisteredVoter', width: 10 },
        { header: 'isPwd', key: 'isPwd', width: 10 },
        { header: 'isDependent', key: 'isDependent', width: 10 },
        { header: 'presentRoomFloorUnitBldg', key: 'presentRoomFloorUnitBldg', width: 20 },
        { header: 'presentHouseLotBlock', key: 'presentHouseLotBlock', width: 20 },
        { header: 'presentStreetname', key: 'presentStreetname', width: 20 },
        { header: 'presentSubdivision', key: 'presentSubdivision', width: 20 },        
        { header: 'presentBarangay', key: 'presentBarangay', width: 20 },        
        { header: 'presentCity', key: 'presentCity', width: 20 },        
        { header: 'presentProvince', key: 'presentProvince', width: 20 },
        { header: 'presentPostal', key: 'presentPostal', width: 10 },        
        { header: 'presentDistrict', key: 'presentDistrict', width: 20 }
      ];

      //console.log(entity);

      var totalPage = Math.ceil(totalRecords/10000);
      //console.log(totalPage);

      for (let i = 0; i < totalPage; i++) {
        var b = await this.breakEntity(i, 10000, entity);

        await b.forEach(r => {
          worksheet.addRow({          
            institutionId: r.institutionId,
            lastName: r.lastName,
            firstName: r.firstName,
            middleName: r.middleName,
            suffix: r.suffix,
            gender: r.gender,          
            civilStatus: r.civilStatus,
            birthDate: r.birthDate,                    
            birthCity: r.birthCity,          
            birthProvince: r.birthProvince,
            noOfChildren: r.noOfChildren,          
            employmentStatus: r.employmentStatus,
            isRegisteredVoter: r.isRegisteredVoter,
            isPwd: r.isPwd,
            isDependent: r.isDependent,
            presentRoomFloorUnitBldg: r.presentRoomFloorUnitBldg,
            presentHouseLotBlock: r.presentHouseLotBlock,
            presentStreetname: r.presentStreetname,
            presentSubdivision: r.presentSubdivision,          
            presentBarangay: r.presentBarangay,          
            presentCity: r.presentCity,          
            presentProvince: r.presentProvince,
            presentPostal: r.presentPostal,          
            presentDistrict: r.presentDistrict
          }).commit();
        });     
      }

       

      const fileName = './SearchCitizen' +  randomIntFromInterval(1000,2000).toString() + '.xlsx';
      
      await workbook.xlsx.writeFile(fileName);      

      result = utilResponsePayloadSuccess(fileName,0,0);      
    }
    catch (error) {
      result = utilResponsePayloadSystemError(error);      
    }

    return result;
  }

  public async breakEntity(pageNumber, pageSize, entity) {
    const initialPos = pageNumber * pageSize;
    return entity.slice(initialPos, initialPos + pageSize);
  }

}
