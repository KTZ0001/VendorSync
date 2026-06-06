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
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_service_1 = require("./prisma/prisma.service");
const auth_module_1 = require("./modules/auth/auth.module");
const prisma_module_1 = require("./prisma/prisma.module");
const vendors_module_1 = require("./modules/vendors/vendors.module");
const rfqs_module_1 = require("./modules/rfqs/rfqs.module");
const quotations_module_1 = require("./modules/quotations/quotations.module");
const orders_module_1 = require("./modules/orders/orders.module");
const activity_module_1 = require("./modules/activity/activity.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            prisma_module_1.PrismaModule,
            vendors_module_1.VendorsModule,
            rfqs_module_1.RfqsModule,
            quotations_module_1.QuotationsModule,
            orders_module_1.OrdersModule,
            activity_module_1.ActivityModule
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            prisma_service_1.PrismaService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map