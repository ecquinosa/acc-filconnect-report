import { Router, Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import { ICamundaService } from "../../service/CamundaService";
import logger from "../../loaders/Logger";
import { ROUTE, SERVICE, ORCHESTRATION, RESPONSE_CODE } from "../../helpers/Constants";
import { IKycService } from "../../service/kycService";
import fileService from "../../service/fileService";

import { IResult, utilResponsePayloadSystemError, utilResponsePayloadSuccess, utilResponsePayloadSuccessNoParam } from "../../helpers/Utility";

const route = Router();

export default (app: Router) => {
  app.use(ROUTE.REPORT.MAIN, route);
  const camundService: ICamundaService = Container.get(SERVICE.CAMUNDA_SERVICE);
  const kycService: IKycService = Container.get(SERVICE.KYC);

  /**
   * This request start a process definition book.
   * process definition id are case sensitive.
   * /example/create
   */
  route.post(ROUTE.REPORT.KYC_SEARCH_CITIZEN, async (req: Request, res: Response, next: NextFunction) => {
    const entity = JSON.parse(JSON.stringify(req.body));

    //const result = await kycService.SearchCitizenv2(entity.payload);
    
    const result = await camundService.Start(
      JSON.stringify(req.body),
      JSON.stringify(req.headers),
      ORCHESTRATION.PROCESS_DEFINITION.REPORT.KYC_SEARCH_CITIZEN
    );    

    //logger.info(result);
    return res.json({ response: result }).status(200);
  });

  route.post(ROUTE.REPORT.KYC_CREATE_CITIZEN, async (req: Request, res: Response, next: NextFunction) => {
    const entity = JSON.parse(JSON.stringify(req.body));

    //const result = await kycService.SearchCitizenv2(entity.payload);
    
    const result = await camundService.Start(
      JSON.stringify(req.body),
      JSON.stringify(req.headers),
      ORCHESTRATION.PROCESS_DEFINITION.REPORT.KYC_CREATE_CITIZEN
    );    

    //logger.info(result);
    return res.json({ response: result }).status(200);
  });

  route.post(ROUTE.REPORT.GET_FILE, async (req: Request, res: Response, next: NextFunction) => {
    const entity = JSON.parse(JSON.stringify(req.body));

    //const result = await kycService.getFilev2(entity.payload);
    
    const result = await camundService.Start(
      JSON.stringify(req.body),
      JSON.stringify(req.headers),
      ORCHESTRATION.PROCESS_DEFINITION.REPORT.GET_FILE
    );
    
    //logger.info(result);
    return res.json({ response: result }).status(200);
  });

  route.post(ROUTE.REPORT.DELETE_FILE, async (req: Request, res: Response, next: NextFunction) => {
    const entity = JSON.parse(JSON.stringify(req.body));

    //const result = await kycService.deleteFilev2(entity.payload);
    
    const result = await camundService.Start(
      JSON.stringify(req.body),
      JSON.stringify(req.headers),
      ORCHESTRATION.PROCESS_DEFINITION.REPORT.DELETE_FILE
    );
    
    //logger.info(result);
    return res.json({ response: result }).status(200);
  });

  route.post(ROUTE.REPORT.LIST_FILE, async (req: Request, res: Response, next: NextFunction) => {
    const entity = JSON.parse(JSON.stringify(req.body));    

    //const fs = new fileService();

    //let result: IResult = null;
    //result = await fs.listObjects(entity.payload);
    //result = await fs.tempDeleteBayambangData(entity.payload);
    
    const result = await camundService.Start(
      JSON.stringify(req.body),
      JSON.stringify(req.headers),
      ORCHESTRATION.PROCESS_DEFINITION.REPORT.LIST_FILE
    );
    
    //logger.info(result);
    return res.json({ response: result }).status(200);
  });
 
};
