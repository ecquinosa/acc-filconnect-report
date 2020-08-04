import { IsUUID } from "class-validator";

// A payload model with custom validation
export class exampleCreateResponseVM {
  @IsUUID()
  uuid: string;

  @IsUUID()
  exampleId: string;
}
