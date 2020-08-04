import { IsUUID } from "class-validator";

// A payload model with custom validation
export class exampleDeleteResponseVM {
  @IsUUID()
  exampleId: string;

  update: Date;
  history: object;
}
