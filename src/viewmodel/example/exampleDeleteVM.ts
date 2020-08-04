import { Length, IsEmail, Validate, IsMobilePhone, IsDateString, IsDate, IsUUID, ValidateIf, ValidateNested } from "class-validator";
import { baseVM } from "../base/baseVM";
import { IsExampleValid } from "./exampleValidation";

// A payload model with custom validation
export class exampleDeletePayloadVM {
  @IsUUID()
  @Validate(IsExampleValid)
  exampleId: string;
}

export class exampleDeleteVM extends baseVM {
  @ValidateNested()
  payload: exampleDeletePayloadVM;
}
