import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { BILLING_SERVICE } from '../constants/service';
import { CreateOrderRequest } from '../dto/create-order-request';
import { OrdersRepository } from '../repositories/orders.repository';
import { Order } from '../schemas/order.schema';
import { OrdersService } from './orders.service';

@Injectable()
export class OrdersServiceImpl implements OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    @Inject(BILLING_SERVICE) private billingClient: ClientProxy,
  ) {}

  async getOrders(): Promise<Order[]> {
    return this.ordersRepository.find({});
  }

  async createOrder(request: CreateOrderRequest): Promise<Order> {
    const session = await this.ordersRepository.startTransaction();
    try {
      const order = this.ordersRepository.create(request, { session });
      await lastValueFrom(
        this.billingClient.emit('order_created', { request }),
      );

      await session.commitTransaction();

      return order;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    }
  }
}
