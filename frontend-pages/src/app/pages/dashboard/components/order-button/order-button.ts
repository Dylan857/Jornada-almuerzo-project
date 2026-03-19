import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../../core/services/order.service';

@Component({
  selector: 'app-order-button',
  imports: [CommonModule, FormsModule],
  templateUrl: './order-button.html',
})
export class OrderButton {
  private orderService = inject(OrderService);

  quantity = signal(1);
  loading = signal(false);
  lastOrderId = signal<string | null>(null);
  error = signal<string | null>(null);

  onQuantityChange(value: string) {
    const num = parseInt(value);
    if (num > 0) this.quantity.set(num);
  }

  placeOrder() {
    if (this.loading()) return;
    this.loading.set(true);
    this.error.set(null);
    this.lastOrderId.set(null);

    this.orderService.createOrder(this.quantity()).subscribe({
      next: (res) => {
        this.lastOrderId.set(res.data.orderId);
        this.loading.set(false);
        this.orderService.loadOrders();
      },
      error: () => {
        this.error.set('Error al crear el pedido. Intenta de nuevo.');
        this.loading.set(false);
      }
    });
  }
}