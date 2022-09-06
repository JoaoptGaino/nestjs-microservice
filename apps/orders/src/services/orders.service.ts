import { CreateOrderRequest } from '../dto/create-order-request';
import { Order } from '../schemas/order.schema';

export interface OrdersService {
  createOrder(request: CreateOrderRequest): Promise<Order>;
  getOrders(): Promise<Order[]>;
}
