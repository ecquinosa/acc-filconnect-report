import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from "class-validator";
import { Example } from "../../entity/Example";
import { getConnection, Not } from "typeorm";

@ValidatorConstraint({ async: true })
export class IsExampleExist implements ValidatorConstraintInterface {
  async validate(text: string, args: ValidationArguments) {
    const object = JSON.stringify(args.object);
    const objectJson = JSON.parse(object);

    var conn = getConnection();
    var repo = await conn.getRepository(Example);
    var result = await repo
      .createQueryBuilder("example")
      .where("example.name = :name", { name: text })
      .andWhere("example.is_reversed = :is_reversed", {
        is_reversed: false,
      })
      .andWhere("example.is_deleted = :is_deleted", {
        is_deleted: false,
      })
      .andWhere("(:uuid IS NULL OR example.uuid != :uuid)", {
        uuid: objectJson.applicationId ? objectJson.applicationId : null,
      })
      .getCount();
    return result === 0; // for async validations you must return a Promise<boolean> here
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return `application already exist`;
  }
}

@ValidatorConstraint({ async: true })
export class IsExampleValid implements ValidatorConstraintInterface {
  async validate(text: string, args: ValidationArguments) {
    const object = JSON.stringify(args.object);
    const objectJson = JSON.parse(object);

    var conn = getConnection();
    var repo = await conn.getRepository(Example);
    var result = await repo
      .createQueryBuilder("example")
      .where("example.uuid = :uuid", { uuid: text })
      .andWhere("example.is_reversed = :is_reversed", {
        is_reversed: false,
      })
      .andWhere("example.is_deleted = :is_deleted", {
        is_deleted: false,
      })
      .getCount();
    return result > 0; // for async validations you must return a Promise<boolean> here
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return `example is not exist`;
  }
}
