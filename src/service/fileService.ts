import { Service, Container } from "typedi";
import LoggerInstance from "../loaders/Logger";
import client from "cloud-config-client";
import { CONFIG, SERVICE } from "../helpers/Constants";

import fs, { fsyncSync } from 'fs';
import AWS from 'aws-sdk';
import { IResult, utilResponsePayloadSystemError, utilResponsePayloadSuccess } from "../helpers/Utility";

export interface IFileService {
  uploadFileFromBase64(entity): Promise<IResult>;
  uploadFile(entity): Promise<IResult>;
  uploadFilePdf(entity): Promise<IResult>;
  getFile(entity): Promise<IResult>;
}

// Service layer where to put all the business logic computation % etc.
@Service()
export default class fileService implements IFileService {
  // Injection

  public async uploadFileFromBase64(entity): Promise<IResult> {
    try {
      const _cloudCOnfig: client.Config = Container.get(SERVICE.CLOUD_CONFIG);
      const s3 = new AWS.S3({ accessKeyId: _cloudCOnfig.get(CONFIG.S3.ACCESSKEYID), secretAccessKey: _cloudCOnfig.get(CONFIG.S3.SECRETACCESSKEY) });

      //var bitmap = Buffer.from(entity.base64.replace(/^data:image\/\w+;base64,/, ""), 'base64');
      //var bitmap = Buffer.from(entity.base64.replace('data:image/png;base64,', ''), 'base64');
      var bitmap = Buffer.from(entity.base64, 'base64');
      //var bitmap = new Buffer(entity.base64, 'base64');
      var outputFile = entity.fileName;
      fs.writeFileSync(outputFile, bitmap);

      const fileContent = fs.readFileSync(outputFile);

      // Setting up S3 upload parameters
      const params = {
        Bucket: _cloudCOnfig.get(CONFIG.S3.BUCKET),
        Key: `${_cloudCOnfig.get(CONFIG.S3.FOLDER)}/${outputFile}`,
        Body: fileContent,
        ContentEncoding: 'base64',
        ContentLength: fileContent.length
      };

      //Uploading files to the bucket     
      var awsUpload = s3.upload(params, function (err, data) {
        if (err) {
          LoggerInstance.error("🔥 error: %o", err);
          return utilResponsePayloadSystemError("Failed to upload");
        }
      }).promise();

      //delete created file
      fs.unlink(outputFile, (err) => { if (err) { LoggerInstance.error("🔥 file deletion error: %o", err); } })

      return await utilResponsePayloadSuccess((await awsUpload).Location, 0, 0);
    }
    catch (error) {
      LoggerInstance.error("🔥 uploadFile error: %o", error);
      return await utilResponsePayloadSystemError(error);
    }
  }

  public async uploadFile(entity): Promise<IResult> {
    try {
      const _cloudCOnfig: client.Config = Container.get(SERVICE.CLOUD_CONFIG);
      const s3 = new AWS.S3({ accessKeyId: _cloudCOnfig.get(CONFIG.S3.ACCESSKEYID), secretAccessKey: _cloudCOnfig.get(CONFIG.S3.SECRETACCESSKEY) });

      var outputFile = entity.fileName;
      var s3File = outputFile.substring(outputFile.lastIndexOf('/') + 1);

      // console.log(outputFile);
      // console.log(s3File);

      const fileContent = fs.readFileSync(outputFile);

      // Setting up S3 upload parameters
      const params = {
        Bucket: _cloudCOnfig.get(CONFIG.S3.BUCKET),
        Key: `${_cloudCOnfig.get(CONFIG.S3.FOLDER)}/${s3File}`,
        Body: fileContent,
        ContentEncoding: 'base64',
        ContentLength: fileContent.length
      };

      //Uploading files to the bucket     
      var awsUpload = s3.upload(params, function (err, data) {
        if (err) {
          LoggerInstance.error("🔥 error: %o", err);
          return utilResponsePayloadSystemError("Failed to upload");
        }
      }).promise();

      //delete created file
      fs.unlink(outputFile, (err) => { if (err) { LoggerInstance.error("🔥 file deletion error: %o", err); } })

      return await utilResponsePayloadSuccess((await awsUpload).Location, 0, 0);
    }
    catch (error) {
      LoggerInstance.error("🔥 uploadFile error: %o", error);
      return await utilResponsePayloadSystemError(error);
    }
  }


  public async uploadFilePdf(entity): Promise<IResult> {
    try {
      const _cloudCOnfig: client.Config = Container.get(SERVICE.CLOUD_CONFIG);
      const s3 = new AWS.S3({ accessKeyId: _cloudCOnfig.get(CONFIG.S3.ACCESSKEYID), secretAccessKey: _cloudCOnfig.get(CONFIG.S3.SECRETACCESSKEY) });

      var outputFile = entity.fileName;
      var s3File = outputFile.substring(outputFile.lastIndexOf('/') + 1);

      // console.log(outputFile);
      // console.log(s3File);

      const PDFDocument = require('pdfkit');
      var doc = entity.doc;

      const fileContent = fs.readFileSync(outputFile);

      // Setting up S3 upload parameters
      const params = {
        Bucket: _cloudCOnfig.get(CONFIG.S3.BUCKET),
        Key: `${_cloudCOnfig.get(CONFIG.S3.FOLDER)}/${s3File}`,
        Body: doc,
        //ContentEncoding: 'base64',
        ContentType: 'application/pdf'
      };

      //Uploading files to the bucket     
      var awsUpload = s3.upload(params, function (err, data) {
        if (err) {
          LoggerInstance.error("🔥 error: %o", err);
          return utilResponsePayloadSystemError("Failed to upload");
        }
      }).promise();

      //delete created file
      fs.unlink(outputFile, (err) => { if (err) { LoggerInstance.error("🔥 file deletion error: %o", err); } })

      return await utilResponsePayloadSuccess((await awsUpload).Location, 0, 0);
    }
    catch (error) {
      LoggerInstance.error("🔥 uploadFile error: %o", error);
      return await utilResponsePayloadSystemError(error);
    }
  }

  public async getFile(entity): Promise<IResult> {
    try {
      const _cloudCOnfig: client.Config = Container.get(SERVICE.CLOUD_CONFIG);
      const s3 = new AWS.S3({ accessKeyId: _cloudCOnfig.get(CONFIG.S3.ACCESSKEYID), secretAccessKey: _cloudCOnfig.get(CONFIG.S3.SECRETACCESSKEY) });

      var ext = entity.location.substring(entity.location.lastIndexOf('.') + 1);
      var s3File = entity.location.substring(entity.location.lastIndexOf('/') + 1);
      //console.log(s3File);

      //var params = { Bucket: _cloudCOnfig.get(CONFIG.S3.BUCKET), Key: s3File };
      var params = { Bucket: _cloudCOnfig.get(CONFIG.S3.BUCKET), Key: `${_cloudCOnfig.get(CONFIG.S3.FOLDER)}/${s3File}` };

      var s3obj = await s3.getObject(params).promise();

      //   s3.getObject(params, function(err, res) {
      //     if (err === null) {
      //        res.attachment('file.ext'); // or whatever your logic needs
      //        res.send(data.Body);
      //     } else {
      //        res.status(500).send(err);
      //     }
      // });

      let buff = await Buffer.from(s3obj.Body);
      let base64 = await buff.toString('base64');

      var response = {
        ext: ext,
        base64: base64
      }

      return await utilResponsePayloadSuccess(response, 0, 0);
    }
    catch (error) {
      LoggerInstance.error("🔥 getFile error: %o", error);
      //return await "Failed to get file";
      return await utilResponsePayloadSystemError(error);
    }
  }

  // public async getFile2(entity) {
  //   try {
  //     const _cloudCOnfig: client.Config = Container.get(SERVICE.CLOUD_CONFIG);
  //     const s3 = new AWS.S3({ accessKeyId: _cloudCOnfig.get(CONFIG.S3.ACCESSKEYID), secretAccessKey: _cloudCOnfig.get(CONFIG.S3.SECRETACCESSKEY) });

  //     var ext = entity.location.substring(entity.location.lastIndexOf('.') + 1);
  //     var s3File = entity.location.substring(entity.location.lastIndexOf('/') + 1);

  //     var params = { Bucket: _cloudCOnfig.get(CONFIG.S3.BUCKET), Key: `${_cloudCOnfig.get(CONFIG.S3.FOLDER)}/${s3File}` };      

  //     var fileStream = fs.createWriteStream(s3File);
  //     var s3Stream = s3.getObject(params).createReadStream();

  //     // Listen for errors returned by the service
  //     s3Stream.on('error', function (err) {
  //       // NoSuchKey: The specified key does not exist
  //       LoggerInstance.error("🔥 NoSuchKey: The specified key does not exist. error: %o", err);        
  //       return utilResponsePayloadSystemError("NoSuchKey: The specified key does not exist");
  //     });

  //     var base64data = null;

  //     s3Stream.pipe(fileStream).on('error', function (err) {
  //       // capture any errors that occur when writing data to the file        
  //       LoggerInstance.error("🔥 File stream error: %o", err);
  //       return utilResponsePayloadSystemError("File stream error");
  //     }).on('close', async function () {
  //       var bitmap = await fs.readFileSync(s3File);
  //       base64data = await new Buffer(bitmap).toString('base64');

  //       return await utilResponsePayloadSuccess(base64data, 0, 0);
  //     });
  //   }
  //   catch (error) {
  //     LoggerInstance.error("🔥 error: %o", error);
  //     return await utilResponsePayloadSystemError(error);
  //   }
  // }


  public async deleteFile(entity): Promise<IResult> {
    try {
      const _cloudCOnfig: client.Config = Container.get(SERVICE.CLOUD_CONFIG);
      const s3 = new AWS.S3({ accessKeyId: _cloudCOnfig.get(CONFIG.S3.ACCESSKEYID), secretAccessKey: _cloudCOnfig.get(CONFIG.S3.SECRETACCESSKEY) });

      var files = [];
      for (var f in entity.files) {
        var s3File = entity.files[f].key.substring(entity.files[f].key.lastIndexOf('/') + 1);        
        files.push({ Key: `${_cloudCOnfig.get(CONFIG.S3.FOLDER)}/${s3File}` });       
      }    

      var deleteParam = {
        Bucket: _cloudCOnfig.get(CONFIG.S3.BUCKET),
        Delete: {
          Objects: files
        }
      };   

      var s = await s3.deleteObjects(deleteParam,  function (err, data) {
            if (err) utilResponsePayloadSystemError(err);  // error
            else return utilResponsePayloadSuccess("Files deleted", 0, 0);                 // deleted
          }).promise();

      //return utilResponsePayloadSuccess("Files deleted", 0, 0);
    }
    catch (error) {
      //console.log(error);
      //LoggerInstance.error("🔥 deleteFile error: %o", error);
      //return await "Failed to get file";
      return await utilResponsePayloadSystemError(error);
    }
  }





}