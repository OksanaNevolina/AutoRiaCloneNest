import { Config } from './config.type';
import * as process from 'node:process';

export default (): Config => ({
  app: {
    port: parseInt(process.env.APP_PORT) || 3000,
    host: process.env.APP_HOST || '0.0.0.0',
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
    port: parseInt(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD,
  },
  jwt: {
    sellerAccessTokenSecret:
      process.env.AUTH_ACCESS_TOKEN_SECRET || 'access_secret_seller',
    sellerAccessTokenExpiration:
      parseInt(process.env.AUTH_ACCESS_TOKEN_EXPIRATION) || 3600,
    sellerRefreshTokenSecret:
      process.env.AUTH_REFRESH_TOKEN_SECRET || 'refresh_secret_seller',
    sellerRefreshTokenExpiration:
      parseInt(process.env.AUTH_REFRESH_TOKEN_EXPIRATION) || 86400,
    managerAccessTokenSecret:
      process.env.AUTH_ACCESS_TOKEN_SECRET || 'access_secret_manager',
    managerAccessTokenExpiration:
      parseInt(process.env.AUTH_ACCESS_TOKEN_EXPIRATION) || 3600,
    managerRefreshTokenSecret:
      process.env.AUTH_REFRESH_TOKEN_SECRET || 'refresh_secret_manager',
    managerRefreshTokenExpiration:
      parseInt(process.env.AUTH_REFRESH_TOKEN_EXPIRATION) || 86400,
    adminAccessTokenSecret:
      process.env.AUTH_ACCESS_TOKEN_SECRET || 'access_secret_admin ',
    adminAccessTokenExpiration:
      parseInt(process.env.AUTH_ACCESS_TOKEN_EXPIRATION) || 3600,
    adminRefreshTokenSecret:
      process.env.AUTH_REFRESH_TOKEN_SECRET || 'refresh_secret_admin',
    adminRefreshTokenExpiration:
      parseInt(process.env.AUTH_REFRESH_TOKEN_EXPIRATION) || 86400,
    forgotSecret:
    process.env.FORGOT_TOKEN_SECRET || 'forgot_secret',
    forgotExpiration:
    parseInt(process.env.FORGOT_TOKEN_EXPIRATION) || 604800000
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
