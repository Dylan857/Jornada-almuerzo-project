import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../../core/services/order.service';

@Component({
  selector: 'app-order-button',
  imports: [FormsModule],
  templateUrl: './order-button.html',
})
export class OrderButton {
  private orderService = inject(OrderService);

  quantity = signal(1);
  loading = signal(false);
  lastOrderId = signal<string | null>(null);
  error = signal<string | null>(null);
  errorValue = signal(false);

  onQuantityChange(value: string) {
    if (value === '') {
      this.quantity.set(1);
      return;
    }

    const num = parseInt(value);
    if (num > 0) this.quantity.set(num);
  }

  placeOrder() {
    if (this.loading()) return;
    this.loading.set(true);
    this.error.set(null);
    this.lastOrderId.set(null);

    if (this.quantity() <= 0 || this.quantity() === null) {
      this.errorValue.set(true);
      this.loading.set(false);
      return;
    }

    this.orderService.createOrder(this.quantity()).subscribe({
      next: (res) => {
        this.lastOrderId.set(res.data.orderId);
        this.loading.set(false);
        this.orderService.loadOrders();
        this.quantity.set(1);
      },
      error: () => {
        this.error.set('Error al crear el pedido. Intenta de nuevo.');
        this.loading.set(false);
      },
    });
  }
}
