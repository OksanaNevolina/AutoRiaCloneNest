import {Module} from "@nestjs/common";
import {UserModule} from "./user/user.module";


@Module({
    imports: [
        // PostgresModule,
        // RedisModule,
        // ConfigModule.forRoot({
        //     load: [configuration],
        //     isGlobal: true,
        // }),
        UserModule,

    ],
    controllers: [],
    providers: [],
})
export class AppModule {}