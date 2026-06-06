"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const orders_service_1 = require("./orders.service");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let OrdersController = class OrdersController {
    ordersService;
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    createPO(quotationId, req) {
        return this.ordersService.createPO(quotationId, req.user.userId);
    }
    createInvoice(poId, req) {
        return this.ordersService.createInvoice(poId, req.user.userId);
    }
    findAllPOs() {
        return this.ordersService.findAllPOs();
    }
    findOnePO(id) {
        return this.ordersService.getPO(id);
    }
    findAllInvoices() {
        return this.ordersService.findAllInvoices();
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Post)('po/:quotationId'),
    (0, swagger_1.ApiOperation)({ summary: 'Convert an approved quotation into a Purchase Order' }),
    __param(0, (0, common_1.Param)('quotationId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "createPO", null);
__decorate([
    (0, common_1.Post)('invoice/:poId'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate an invoice from a Purchase Order' }),
    __param(0, (0, common_1.Param)('poId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "createInvoice", null);
__decorate([
    (0, common_1.Get)('po'),
    (0, swagger_1.ApiOperation)({ summary: 'List all Purchase Orders' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "findAllPOs", null);
__decorate([
    (0, common_1.Get)('po/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get detailed PO with tax info and items' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "findOnePO", null);
__decorate([
    (0, common_1.Get)('invoices'),
    (0, swagger_1.ApiOperation)({ summary: 'List all Invoices' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "findAllInvoices", null);
exports.OrdersController = OrdersController = __decorate([
    (0, swagger_1.ApiTags)('Purchase Orders & Invoices'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map