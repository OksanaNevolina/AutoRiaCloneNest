export type Config = {
  app: AppConfig;
  postgres: PostgresConfig;
  redis: RedisConfig;
  jwt: JWTConfig;
};

export type AppConfig = {
  port: number;
  host: string;
};
export type PostgresConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  dbName: string;
};

export type RedisConfig = {
  port: number;
  host: string;
  password: string;
};
export type JWTConfig = {
  sellerAccessTokenSecret: string;
  sellerAccessTokenExpiration: number;
  sellerRefreshTokenSecret: string;
  sellerRefreshTokenExpiration: number;
  managerAccessTokenSecret: string;
  managerAccessTokenExpiration: number;
  managerRefreshTokenSecret: string;
  managerRefreshTokenExpiration: number;
  adminAccessTokenSecret: string;
  adminAccessTokenExpiration: number;
  adminRefreshTokenSecret: string;
  adminRefreshTokenExpiration: number;
};
