import { Service, Container } from "typedi";
import { validate, ValidationError } from "class-validator";
import { getConnection } from "typeorm"; // to get the configure db connection.
import { KycSearchCitizen } from "../entity/kycSearchCitizen";
//import { exampleCreateResponseVM } from "../viewmodel/example/exampleCreateResponseVM";
import { RESPONSE_CODE, STATUS } from "../helpers/Constants";
import { IResult, utilResponsePayloadSuccess, utilResponsePayloadNoData, utilResponsePayloadInvalidParameter, utilResponsePayloadSystemError, utilResponsePayloadSuccessNoParam, randomIntFromInterval } from "../helpers/Utility";
import fs, { fsyncSync } from 'fs';
import { bool } from "aws-sdk/clients/signer";

import fileService from "./fileService";

export interface IPDFService {
  SaveToPdf(entity, totalRecords, isSaveToS3): Promise<IResult>;
}

// Service layer where to put all the business logic computation % etc.
@Service()
export default class PDFService implements IPDFService {

  public async SaveToPdf(entity: any, totalRecords: number, isSaveToS3: bool): Promise<IResult> {
    let result: IResult = null;

    try {
      const fileName = './SearchCitizen' + randomIntFromInterval(1000, 2000).toString() + '.pdf';

      const PDFDocument = require('pdfkit');

      var doc = new PDFDocument({ layout: 'landscape' });

      doc.pipe(fs.createWriteStream(fileName));

      //console.log("total : " + totalRecords.toString());

      var recordBreaker = 47;
      var totalPage = Math.ceil(totalRecords / recordBreaker);

      var xBase = 20
      var yBase = 60

      var x = xBase;
      var y = yBase;
      var width = 30;
      var height = 100;

      var recordCntr = 1;

      let columnParams = [];
      columnParams[0] = ["FIRST NAME", 0, 60];
      columnParams[1] = ["MIDDLE NAME", 1, 60];
      columnParams[2] = ["LAST NAME", 2, 60];
      columnParams[3] = ["SUFFIX", 3, 40];
      columnParams[4] = ["BIRTHDATE", 4, 40];
      columnParams[5] = ["GENDER", 5, 30];
      columnParams[6] = ["CIVIL STATUS", 6, 45];
      columnParams[7] = ["NO. OF CHILDREN", 7, 45];
      columnParams[8] = ["BARANGAY", 8, 60];
      columnParams[9] = ["STREETNAME", 9, 60];
      columnParams[10] = ["MOBILE NOS.", 10, 60];
      columnParams[11] = ["TELEPHONE NOS.", 11, 60];
      columnParams[12] = ["EMAIL", 12, 60];

      for (let i = 0; i < totalPage; i++) {
        var b = await this.breakEntity(i, recordBreaker, entity);

        //headers
        for (var c in columnParams) {
          this.textInRow(doc, columnParams[c][0], x, y - 10, columnParams[c][2], true);
          x += columnParams[c][2];
        }

        x = xBase;

        await b.forEach(r => {
          var dob = new Date(r.birthDate);
          dob.setHours(0, 0, 0, 0);

          var valueParams: string[] = [r.firstName, r.middleName, r.lastName, r.suffix, dob.toISOString().slice(0, 10), r.gender, r.civilStatus, r.noOfChildren, r.presentBarangay, r.presentStreetname, r.mobileNos, r.telephoneNos, r.email];

          //body
          for (var c in columnParams) {
            this.textInRow(doc, valueParams[columnParams[c][1]], x, y, columnParams[c][2], false);
            x += columnParams[c][2];
          }

          recordCntr += 1;
          y += 10;
          x = xBase;
        });

        if (i < (totalPage - 1)) {
          y = yBase;
          doc.addPage();
        }
      }

      doc.end();

      if (isSaveToS3) {
        const fs2 = new fileService();

        //var fsResult = await fs.uploadFilePdf({ "fileName": saveToPdf.value.response });
        result = await fs2.uploadFilePdf({ "fileName": fileName, "doc": doc });
      }
      else result = utilResponsePayloadSuccess(fileName, 0, 0);
    }
    catch (error) {
      result = utilResponsePayloadSystemError(error);
    }

    return result;
  }

  // public async SaveToPdf_bak(entity: any, totalRecords: number, isSaveToS3: bool): Promise<IResult> {
  //   let result: IResult = null;

  //   try {
  //     const fileName = './SearchCitizen' + randomIntFromInterval(1000, 2000).toString() + '.pdf';

  //     const PDFDocument = require('pdfkit');

  //     var doc = new PDFDocument({ layout: 'landscape' });

  //     doc.pipe(fs.createWriteStream(fileName));

  //     console.log("total : " + totalRecords.toString());

  //     var recordBreaker = 47;
  //     var totalPage = Math.ceil(totalRecords / recordBreaker);

  //     var xBase = 20
  //     var yBase = 60

  //     var x = xBase;
  //     var y = yBase;
  //     var width = 30;
  //     var height = 100;

  //     var recordCntr = 1;

  //     for (let i = 0; i < totalPage; i++) {
  //       var b = await this.breakEntity(i, recordBreaker, entity);

  //       //header
  //       this.textInRow(doc, "#", x, y - 10, 15);
  //       x += 15;
  //       this.textInRow(doc, "institutionId", x, y - 10, 100);
  //       x += 100;
  //       this.textInRow(doc, "lastName", x, y - 10, 60);
  //       x += 60;
  //       this.textInRow(doc, "firstName", x, y - 10, 60);
  //       x += 60;
  //       this.textInRow(doc, "middleName", x, y - 10, 60);
  //       x += 60;
  //       this.textInRow(doc, "suffix", x, y - 10, 35);
  //       x += 35;
  //       this.textInRow(doc, "gender", x, y - 10, 30);
  //       x += 30;
  //       this.textInRow(doc, "birth date", x, y - 10, 40);
  //       x += 40;
  //       this.textInRow(doc, "civilStatus", x, y - 10, 45);
  //       x += 45;
  //       this.textInRow(doc, "employmentStatus", x, y - 10, 75);
  //       x += 75;
  //       this.textInRow(doc, "presentBarangay", x, y - 10, 60);
  //       x += 60;
  //       this.textInRow(doc, "presentCity", x, y - 10, 60);
  //       x += 60;
  //       this.textInRow(doc, "presentProvince", x, y - 10, 60);
  //       x += 60;
  //       this.textInRow(doc, "presentDistrict", x, y - 10, 60);

  //       x = xBase;

  //       await b.forEach(r => {
  //         var dob = new Date(r.birthDate);
  //         dob.setHours(0, 0, 0, 0);

  //         this.textInRow(doc, recordCntr.toString(), x, y, 15);
  //         x += 15;
  //         this.textInRow(doc, r.institutionId, x, y, 100);
  //         x += 100;
  //         this.textInRow(doc, r.lastName, x, y, 60);
  //         x += 60;
  //         this.textInRow(doc, r.firstName, x, y, 60);
  //         x += 60;
  //         this.textInRow(doc, r.middleName, x, y, 60);
  //         x += 60;
  //         this.textInRow(doc, r.suffix, x, y + 5.7, 35);
  //         x += 35;
  //         this.textInRow(doc, r.gender, x, y, 30);
  //         x += 30;
  //         this.textInRow(doc, dob.toISOString().slice(0, 10), x, y, 40);
  //         x += 40;
  //         this.textInRow(doc, r.civilStatus, x, y, 45);
  //         x += 45;
  //         this.textInRow(doc, r.employmentStatus, x, y, 75);
  //         x += 75;
  //         this.textInRow(doc, r.presentBarangay, x, y, 60);
  //         x += 60;
  //         this.textInRow(doc, r.presentCity, x, y, 60);
  //         x += 60;
  //         this.textInRow(doc, r.presentProvince, x, y, 60);
  //         x += 60;
  //         this.textInRow(doc, r.presentDistrict, x, y, 60);

  //         recordCntr += 1;
  //         y += 10;
  //         x = xBase;
  //       });

  //       if (i < (totalPage - 1)) {
  //         y = yBase;
  //         doc.addPage();
  //       }
  //     }

  //     doc.end();

  //     if (isSaveToS3) {
  //       const fs2 = new fileService();

  //       //var fsResult = await fs.uploadFilePdf({ "fileName": saveToPdf.value.response });
  //       result = await fs2.uploadFilePdf({ "fileName": fileName, "doc": doc });
  //     }
  //     else result = utilResponsePayloadSuccess(fileName, 0, 0);
  //   }
  //   catch (error) {
  //     result = utilResponsePayloadSystemError(error);
  //   }

  //   return result;
  // }

  public async textInRowFirst(doc, text, heigth) {
    doc.y = heigth;
    doc.x = 30;
    doc.fillColor('black')
    doc.text(text, {

      paragraphGap: 5,
      indent: 5,
      align: 'justify',
      columns: 1,
    });
    return doc
  }

  public async textInRow(doc, text, x, y, width, isBoldText) {
    doc.x = x;
    doc.y = y;
    if(isBoldText)doc.font('Times-Bold')
    else doc.font('Times-Roman');
    doc.fontSize(5);
    doc.text(text, {
      width: width,      
      align: 'left'
    }
    );
    //doc.rect(doc.x - 3, doc.y - 10, width, 10).stroke();
    // doc.y = y;
    // doc.x = x;
    // doc.fillColor('black')    
    //  .lineJoin('miter')
    //  .rect(x, y, 50, 50)
    //  .stroke();

    // doc.font('./src/fonts/ARIAL.TTF')
    //   .fontSize(5)
    //   .text(text, 100, 100);

    // doc.fontSize(5)
    //   .text(text, {      
    //   paragraphGap: 5,
    //   indent: 5,
    //   align: 'justify',
    //   columns: 2,
    // });
    return doc
  }


  public async row(doc, heigth) {
    doc.lineJoin('miter')
      .rect(30, heigth, 500, 20)
      .stroke()
    return doc
  }

  public async breakEntity(pageNumber, pageSize, entity) {
    const initialPos = pageNumber * pageSize;
    return entity.slice(initialPos, initialPos + pageSize);
  }

}
