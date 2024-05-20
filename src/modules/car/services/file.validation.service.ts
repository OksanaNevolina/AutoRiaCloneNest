import { BadRequestException, Injectable } from '@nestjs/common';
import { fileUploadCarConfig } from '../../../configs/file.upload.car.config';

@Injectable()
export class FileValidationService {
  constructor() {}

   public validateFiles(files: Express.Multer.File[]) {
    files.forEach((file) => {
      if (!fileUploadCarConfig.MIMETYPE.includes(file.mimetype)) {
        throw new BadRequestException(`Invalid file type: ${file.mimetype}`);
      }

      if (file.size > fileUploadCarConfig.MAX_SIZE) {
        throw new BadRequestException(`File size exceeds limit: ${file.size}`);
      }
    });
  }
}
