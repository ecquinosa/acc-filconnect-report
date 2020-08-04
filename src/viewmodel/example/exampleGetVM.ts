import { Length, IsUUID, IsObject, ValidateNested, Validate } from "class-validator";
import { baseVM } from "../base/baseVM";
import { IsExampleValid } from "./exampleValidation";

export class exampleGetPayloadVM {
  @IsUUID("all")
  @Validate(IsExampleValid)
  exampleId: string;
}

export class exampleGetVM extends baseVM {
  @ValidateNested()
  payload: exampleGetPayloadVM;
}
