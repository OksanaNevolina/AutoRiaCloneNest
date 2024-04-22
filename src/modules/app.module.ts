import {Module} from "@nestjs/common";
import {UserModule} from "./user/user.module";
import {ConfigModule} from "@nestjs/config";
import configuration from '../configs/configs';


@Module({
    imports: [
        // PostgresModule,
        // RedisModule,
        ConfigModule.forRoot({
            load: [configuration],
            isGlobal: true,
        }),
        UserModule,

    ],
    controllers: [],
    providers: [],
})
export class AppModule {}