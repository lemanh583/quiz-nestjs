import { ArgumentMetadata, BadRequestException, PipeTransform } from "@nestjs/common";

export class ValidateMultiFileSizePipe implements PipeTransform {
  transform(files: any[], metadata: ArgumentMetadata) {
    // Kiểm tra tổng kích thước của các file upload
    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    if (totalSize > 1024 * 160) {
      throw new BadRequestException('Total file size exceeds limit.');
    }

    return files;
  }
}

