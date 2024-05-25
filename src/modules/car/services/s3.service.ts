import {Injectable, Logger} from "@nestjs/common";
import { DeleteObjectCommand, PutObjectCommand, S3 } from "@aws-sdk/client-s3";


import { TypeFileUploadEnum } from "../enums/type-file-upload.enum";
import * as path from "path";
import { ConfigService } from "@nestjs/config";
import { AWSs3Config, Config } from "../../../configs/config.type";

@Injectable()
export class S3Service {
    private readonly client: S3;

    constructor(private readonly configService: ConfigService<Config>) {
        const AWSs3Config = this.configService.get<AWSs3Config>("AWSs3");
        this.client = new S3({
            region: AWSs3Config.awsS3Region,
            credentials: {
                accessKeyId: AWSs3Config.awsS3AccessKey,
                secretAccessKey: AWSs3Config.awsS3SecretKey,
            },
        });
    }

    async uploadFile(
        file: Express.Multer.File,
        itemType: TypeFileUploadEnum,
        itemId: string,
    ): Promise<any> {
        const filePath = this.buildFilePath(itemType, itemId, file.originalname);
        const AWSs3Config = this.configService.get<AWSs3Config>("AWSs3");
        await this.client.send(
            new PutObjectCommand({
                Key: filePath,
                Bucket: AWSs3Config.awsS3BucketName,
                Body: file.buffer,
                ContentType: file.mimetype,
                ACL: "public-read",
            }),
        );

        return filePath;
    }
    async deleteFile(filePath: string): Promise<void> {
        try {
            const AWSs3Config = this.configService.get<AWSs3Config>("AWSs3");
            const decodedFilePath = decodeURIComponent(filePath);
            Logger.log(`Deleting file from S3: ${decodedFilePath}`);

            const command = new DeleteObjectCommand({
                Key: decodedFilePath,
                Bucket: AWSs3Config.awsS3BucketName,
            });

            await this.client.send(command);
            Logger.log(`Successfully deleted file: ${decodedFilePath}`);
        } catch (error) {
            Logger.error(`Error deleting file: ${error.message}`);
            throw new Error(`Error deleting file: ${error.message}`);
        }
    }

    // async deleteFile(filePath: string): Promise<void> {
    //     const AWSs3Config = this.configService.get<AWSs3Config>("AWSs3");
    //     await this.client.send(
    //         new DeleteObjectCommand({
    //             Key: filePath,
    //             Bucket: AWSs3Config.awsS3BucketName,
    //         }),
    //     );
    // }
    private buildFilePath(
        itemType: TypeFileUploadEnum,
        itemId: string,
        fileName: string,
    ) {
        return `${itemType}/${itemId}/${crypto.randomUUID()}${path.extname(fileName)}`;
    }
}