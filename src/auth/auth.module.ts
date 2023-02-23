import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport/dist";
import { configProvider } from "src/config/config.provider";
import { HashModule } from "src/hash/hash.module";
import { UsersModule } from "src/users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategies/jwtStrategy";
import { LocalStrategy } from "./strategies/localStrategy";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { getJwtConfig } from "src/config/jwtConfig";


@Module({
    imports: [
        UsersModule,
        PassportModule,
        HashModule,
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: getJwtConfig,
            inject: [ConfigService],
        })
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, LocalStrategy]
})

export class AuthModule {}