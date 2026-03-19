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

  quantityValue = 1;
  quantity = signal(1);
  loading = signal(false);
  lastOrderId = signal<string | null>(null);
  error = signal<string | null>(null);
  errorValue = signal(false);

  onQuantityChange(value: number) {
    if (!value || value <= 0) {
      this.errorValue.set(true);
    } else {
      this.quantity.set(value);
      this.errorValue.set(false);
    }
  }

  placeOrder() {
    if (this.loading()) return;

    if (this.quantityValue <= 0) {
      this.errorValue.set(true);
      return;
    } 

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
      },
    });
  }
}
