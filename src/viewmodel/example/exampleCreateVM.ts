import { Length, IsEmail, Validate, IsMobilePhone, IsDateString, IsDate, IsUUID, ValidateIf, ValidateNested } from "class-validator";
import { baseVM } from "../base/baseVM";
import { IsExampleExist } from "./exampleValidation";

// A payload model with custom validation
export class exampleCreatePayloadVM {
  @Length(0, 30)
  @Validate(IsExampleExist)
  name: string;
  @Length(0, 70)
  description: string;
  @Length(0, 70)
  email: string;
}

export class exampleCreateVM extends baseVM {
  @ValidateNested()
  payload: exampleCreatePayloadVM;
}
