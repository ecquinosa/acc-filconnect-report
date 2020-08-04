import { Length, IsUUID, IsObject, ValidateNested } from "class-validator";
import { baseVM } from "../base/baseVM";

export class exampleSearchPayloadVM {
  value: string;
}

export class exampleSearchVM extends baseVM {
  @ValidateNested()
  payload: exampleSearchPayloadVM;
}
