import {
  IsUUID,
  IsObject,
  ValidateIf,
  IsNumber,
  ValidateNested,
  IsUrl,
} from "class-validator";

export class paginationVM {
  @IsNumber()
  count: number;
  @IsNumber()
  page: number;
}

export class callBackVM {
  @IsUrl()
  success: string;
  @IsUrl()
  failed: string;
  @IsUrl()
  cancel: string;
}

export class baseVM {
  // Custom validation.
  @IsUUID("all")
  notificationId: string;

  @ValidateNested()
  pagination: paginationVM;

  @ValidateIf((a) => a.callBackUrl !== undefined)
  @ValidateNested()
  callBackUrl: callBackVM;
}
