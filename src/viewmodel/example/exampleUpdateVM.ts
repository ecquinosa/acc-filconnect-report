import { Length, IsEmail, Validate, IsMobilePhone, IsDateString, IsDate, IsUUID, ValidateIf, ValidateNested } from "class-validator";
import { baseVM } from "../base/baseVM";
import { IsExampleValid } from "./exampleValidation";

// A payload model with custom validation
export class exampleUpdatePayloadVM {
  @Length(0, 30)
  name: string;
  @Length(0, 70)
  description: string;
  @Length(0, 70)
  email: string;
  @IsUUID()
  @Validate(IsExampleValid)
  exampleId: string;
}

export class exampleUpdateVM extends baseVM {
  @ValidateNested()
  payload: exampleUpdatePayloadVM;
}
