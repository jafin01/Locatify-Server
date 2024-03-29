"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const auth_module_1 = require("./auth/auth.module");
const accessToken_guard_1 = require("./common/guards/accessToken.guard");
const prisma_module_1 = require("./prisma/prisma.module");
const circle_module_1 = require("./circle/circle.module");
const places_module_1 = require("./places/places.module");
const locations_module_1 = require("./locations/locations.module");
const devices_module_1 = require("./devices/devices.module");
const users_module_1 = require("./users/users.module");
const sessiontime_module_1 = require("./sessiontime/sessiontime.module");
const mail_module_1 = require("./mailer/mail.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath: '.env',
                isGlobal: true,
            }),
            auth_module_1.AuthModule,
            prisma_module_1.PrismaModule,
            circle_module_1.CircleModule,
            places_module_1.PlacesModule,
            locations_module_1.LocationsModule,
            devices_module_1.DevicesModule,
            users_module_1.UsersModule,
            sessiontime_module_1.SessiontimeModule,
            mail_module_1.MailModule,
        ],
        controllers: [],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: accessToken_guard_1.AccessTokenGuard,
            },
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map