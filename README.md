# auto-ria-clone-nest

## Description

The **auto-ria-clone-nest** project is a clone of a car sales web application built using the NestJS framework.

## Installation

To install all necessary dependencies, run the following command:

```bash
npm install
```
## Scripts
The project includes the following scripts:
```bash
"build": "nest build" - Build the project.
```
```bash
"format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"" - Format code using Prettier.
```
```bash
 "start:docker:local": "docker compose --env-file ./environments/local.env -f ./docker-compose-local.yaml up --build" - Start in Docker with local settings.
 ```
```bash
"start": "nest start" - Start the project.
```
```bash
"start:dev": "nest start --watch -e \"node --env-file ./environments/local.env\"" - Start the project in development mode.
```
```bash
start:debug": "nest start --debug --watch" - Start the project in debug mode.
```
```bash
"start:prod": "node dist/main" - Start the built project.
```
```bash
"lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix" - Check and fix code style using ESLint.
```
```bash
 "test": "jest" - Run tests.
 ```
```bash
"test:watch": "jest --watch" - Run tests in watch mode.
```
```bash
"test:cov": "jest --coverage" - Run tests with coverage report.
```
```bash
 "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand" - Debug tests.
 ```
```bash
"test:e2e": "jest --config ./test/jest-e2e.json" - Run end-to-end tests.
```
```bash
"prepare": "husky" - Prepare Husky hooks.
```
```bash
"typeorm": "typeorm-ts-node-commonjs --dataSource ./ormconfig.ts" - Run TypeORM commands.
```
```bash
"migration:create": "cross-var npm run typeorm -- migration:create ./src/database/migrations/$npm_config_name" - Create a new migration.
```
```bash
"migration:generate": "cross-var npm run typeorm -- migration:generate ./src/database/migrations/$npm_config_name" - Generate a migration based on changes in entities.
```
```bash
"migration:revert": "npm run typeorm -- migration:revert" - Revert the last migration.
```
```bash
"migration:run": "npm run typeorm -- migration:run" - Apply migrations.
```
## Dependencies
### Main project dependencies:

- @aws-sdk/client-s3
- @nestjs/common
- @nestjs/config
- @nestjs/core
- @nestjs/jwt
- @nestjs/mapped-types
- @nestjs/platform-express
- @nestjs/schedule
- @nestjs/swagger
- @nestjs/typeorm
- aws-sdk
- axios
- bcrypt
- class-transformer
- class-validator
- cross-var
- express-fileupload
- ioredis
- multer
- nestjs-typeorm-paginate
- nodemailer
- nodemailer-express-handlebars
- pg
- reflect-metadata
- rxjs
- typeorm
## Development Dependencies
### Dependencies for development:

- @nestjs/cli
- @nestjs/schematics
- @nestjs/testing
- @types/express
- @types/jest
- @types/node
- @types/nodemailer
- @types/nodemailer-express-handlebars
- @types/supertest
- @typescript-eslint/eslint-plugin
- @typescript-eslint/parser
- eslint
- eslint-config-prettier
- eslint-plugin-import
- eslint-plugin-prettier
- eslint-plugin-simple-import-sort
- husky
- jest
- lint-staged
- prettier
- source-map-support
- supertest
- ts-jest
- ts-loader
- ts-node
- tsconfig-paths
- typescript
- @types/express-fileupload

## Lint-Staged Configuration
```bash
"lint-staged": {
"{src,test}/**/*.ts": "eslint --fix"
}
```

## Environment Requirements
**The project requires Node.js version from 20.0.0 to 21.0.0.**

## Jest Configuration
```bash
"jest": {
  "moduleFileExtensions": [
    "js",
    "json",
    "ts"
  ],
  "rootDir": "src",
  "testRegex": ".*\\.spec\\.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  "collectCoverageFrom": [
    "**/*.(t|j)s"
  ],
  "coverageDirectory": "../coverage",
  "testEnvironment": "node"
}

```
## Authors
- **Oksana Nevolina** - [GitHub Profile](https://github.com/OksanaNevolina)