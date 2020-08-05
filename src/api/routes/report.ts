import { Router, Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import { ICamundaService } from "../../service/CamundaService";
import logger from "../../loaders/Logger";
import { ROUTE, SERVICE, ORCHESTRATION, RESPONSE_CODE } from "../../helpers/Constants";
import { IKycService } from "../../service/kycService";

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
    // const validationResult = await exampleService.validateCreateVM(req.body);
    // if (validationResult.length > 0) {
    //   // invalid model.
    //   logger.error("🔥 validation error: %o", validationResult);
    //   var errrorResponse = {
    //     responseCode: RESPONSE_CODE.INVALID_PARAMETER.CODE,
    //     responseMessage: RESPONSE_CODE.INVALID_PARAMETER.MESSAGE,
    //     responseCount: 0,
    //     TotalCount: 0,
    //     response: validationResult,
    //   };
    //   return res.status(400).send(errrorResponse);
    // }

    const entity = JSON.parse(JSON.stringify(req.body));

    const result = await kycService.SearchCitizen(entity);
    
    // const result = await camundService.Start(
    //   JSON.stringify(req.body),
    //   JSON.stringify(req.headers),
    //   ORCHESTRATION.PROCESS_DEFINITION.REPORT.KYC_SEARCH_CITIZEN
    // );

    //var result = true;

    //logger.info(result);
    return res.json({ response: result }).status(200);
  });

  route.post(ROUTE.REPORT.GET_FILE, async (req: Request, res: Response, next: NextFunction) => {
    const entity = JSON.parse(JSON.stringify(req.body));

    const result = await kycService.getFile(entity);
    
    // const result = await camundService.Start(
    //   JSON.stringify(req.body),
    //   JSON.stringify(req.headers),
    //   ORCHESTRATION.PROCESS_DEFINITION.REPORT.KYC_SEARCH_CITIZEN
    // );
    
    return res.json({ response: result }).status(200);
  });
 
};
