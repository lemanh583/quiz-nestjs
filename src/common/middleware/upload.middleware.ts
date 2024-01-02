// upload.middleware.ts

import { Injectable } from '@nestjs/common';
import { MulterOptionsFactory, MulterModuleOptions } from '@nestjs/platform-express/multer';
import { diskStorage } from 'multer';
import { Helper } from 'src/common/helper';

@Injectable()
export class UploadMiddleware implements MulterOptionsFactory {
  createMulterOptions(): MulterModuleOptions {
    return {
      storage: diskStorage({
        destination: './uploads', // Thư mục để lưu trữ file tải lên
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          let regex = /\.([0-9a-z]+)$/i
          const extension = file.originalname.match(regex)?.[1];
          file.originalname = file.originalname.replaceAll(extension, '')
          let newFileName = Helper.removeAccents(file.originalname, false) + '.' + extension
          cb(null, file.fieldname + '-' + uniqueSuffix + newFileName);
        },
      }),
      limits: {
        fileSize: 25 * 1024 * 1024, // 25MB limit,
      }
    };
  }
}
