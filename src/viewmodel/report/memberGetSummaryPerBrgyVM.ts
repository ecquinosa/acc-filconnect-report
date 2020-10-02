import { Length, IsUUID, IsDateString, IsISO8601, IsDate, IsOptional } from "class-validator";
import { isDate } from "util";

// A payload model with custom validation
export class memberGetSummaryPerBrgyVM {
  // validation using class validator

  @IsUUID()
  institutionId: string;  
  
  @Length(0, 200)
  city: string;
  
  @Length(0, 200)
  province: string;

}
