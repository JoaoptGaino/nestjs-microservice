import { JwtAuthGuard } from '@app/common/auth/jwt-auth.guard';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateOrderRequest } from '../dto/create-order-request';
import { OrdersServiceImpl } from '../services/orders.service.impl';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersServiceImpl) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createOrder(@Body() request: CreateOrderRequest) {
    return this.ordersService.createOrder(request);
  }

  @Get()
  async getOrders() {
    return this.ordersService.getOrders();
  }
}
