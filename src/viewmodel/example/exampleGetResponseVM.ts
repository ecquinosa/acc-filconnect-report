import { Length, IsUUID } from "class-validator";
import { baseVM } from "../base/baseVM";

// A payload model with custom validation
export class exampleGetResponseVM {
  @Length(0, 30)
  name: string;
  @Length(0, 70)
  description: string;
  @Length(0, 70)
  email: string;
  @IsUUID()
  exampleId: string;
}
