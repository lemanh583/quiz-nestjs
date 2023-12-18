import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";
import * as fs from "fs";
export class ValidateMultiFileSizePipe implements PipeTransform {
  transform(formdata: any, metadata: ArgumentMetadata) {
    if(!Array.isArray(formdata)) return formdata

    const totalSize = formdata.reduce((acc, file) => acc + file.size, 0);
    if (totalSize > 1024 * 1024 * 25) {
      formdata.map((file) => fs.unlinkSync(file.path))
      throw new BadRequestException('Total file size exceeds limit 25mb.');
    }
    return formdata;
  }
}

