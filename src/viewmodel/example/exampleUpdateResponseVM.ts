import { IsUUID } from "class-validator";

// A payload model with custom validation
export class exampleUpdateResponseVM {
  @IsUUID()
  exampleId: string;

  update: Date;
  history: object;
}
