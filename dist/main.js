"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./modules/app.module");
const swagger_helper_1 = require("./common/helpers/swagger.helper");
const global_exception_filter_1 = require("./common/exeptions/global-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = new swagger_1.DocumentBuilder()
        .setTitle('AutoRiaCloneNest API')
        .setDescription('API description')
        .setVersion('1.0.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
    })
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_helper_1.SwaggerHelper.setDefaultResponses(document);
    swagger_1.SwaggerModule.setup('docs', app, document, {
        swaggerOptions: {
            docExpansion: 'list',
            defaultModelExpandDepth: 3,
            persistAuthorization: true,
        },
    });
    app.useGlobalFilters(new global_exception_filter_1.GlobalExceptionFilter());
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        forbidNonWhitelisted: true,
        whitelist: true,
    }));
    const configService = app.get((config_1.ConfigService));
    const appConfig = configService.get('app');
    await app.listen(appConfig.port, () => {
        const url = `http://${appConfig.host}:${appConfig.port}`;
        common_1.Logger.log(`Server running ${url}`);
        common_1.Logger.log(`Swagger running ${url}/docs`);
    });
}
void bootstrap();
//# sourceMappingURL=main.js.map