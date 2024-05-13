import { Config } from './config.type';
import * as process from 'node:process';

export default (): Config => ({
  app: {
    port: parseInt(process.env.APP_PORT),
    host: process.env.APP_HOST,
  },
  postgres: {
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    dbName: process.env.POSTGRES_DB,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
  },
  jwt: {
    sellerAccessTokenSecret:
      process.env.SALLER_AUTH_ACCESS_TOKEN_SECRET,
    sellerAccessTokenExpiration:
      parseInt(process.env.SALLER_AUTH_ACCESS_TOKEN_EXPIRATION),
    sellerRefreshTokenSecret:
      process.env.SALLER_AUTH_REFRESH_TOKEN_SECRET,
    sellerRefreshTokenExpiration:
      parseInt(process.env.SALLER_AUTH_REFRESH_TOKEN_EXPIRATION),
    managerAccessTokenSecret:
      process.env.MAMAGER_AUTH_ACCESS_TOKEN_SECRET,
    managerAccessTokenExpiration:
      parseInt(process.env.MAMAGER_AUTH_ACCESS_TOKEN_EXPIRATION),
    managerRefreshTokenSecret:
      process.env.MAMAGER_AUTH_REFRESH_TOKEN_SECRET,
    managerRefreshTokenExpiration:
      parseInt(process.env.MAMAGER_AUTH_REFRESH_TOKEN_EXPIRATION),
    adminAccessTokenSecret:
      process.env.ADMIN_AUTH_ACCESS_TOKEN_SECRET,
    adminAccessTokenExpiration:
      parseInt(process.env.ADMIN_AUTH_ACCESS_TOKEN_EXPIRATION),
    adminRefreshTokenSecret:
      process.env.ADMIN_AUTH_REFRESH_TOKEN_SECRET,
    adminRefreshTokenExpiration:
      parseInt(process.env.ADMIN_AUTH_REFRESH_TOKEN_EXPIRATION),
    forgotSecret:
    process.env.FORGOT_TOKEN_SECRET,
    forgotExpiration:
    parseInt(process.env.FORGOT_TOKEN_EXPIRATION)
  },
  smtp:{
    userSmtp:
    process.env.SMTP_USER ,
    passSmtp:
    process.env.SMTP_PASSWORD
  },
  frontURL:{
    frontURL: process.env.FRONT_URL,
  },
  AWSs3:{
    awsS3AccessKey:
        process.env.AWS_S3_ACCESS_KEY,
    awsS3SecretKey:
        process.env.AWS_S3_SECRET_KEY,
    awsS3BucketName:
    process.env.AWS_S3_BUCKET_NAME,
    awsS3Region:
        process.env.AWS_S3_REGION,
    awsS3URL:
        process.env.AWS_S3_URL
  }
});
