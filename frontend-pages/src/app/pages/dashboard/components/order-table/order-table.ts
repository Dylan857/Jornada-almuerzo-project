import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Order, OrderService } from '../../../../core/services/order.service';

@Component({
  selector: 'app-order-table',
  imports: [DatePipe],
  templateUrl: './order-table.html',
})
export class OrderTable {
  orderService = inject(OrderService);

  selectedOrderRecipes = signal<any[]>([]);
  selectedOrderId = signal<string | null>(null);
  modalOpen = signal(false);
  loadingRecipes = signal(false);
  completingId = signal<string | null>(null);

  statusLabel: Record<string, string> = {
    pending: 'Pendiente',
    preparing: 'Preparando',
    in_kitchen: 'En cocina',
    completed: 'Completado',
    failed: 'Fallido',
  };

  statusClass: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    preparing: 'bg-blue-100 text-blue-700',
    in_kitchen: 'bg-purple-100 text-purple-700',
    completed: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
  };

  viewRecipes(order: Order) {
    this.selectedOrderId.set(order.id);
    this.loadingRecipes.set(true);
    this.modalOpen.set(true);

    this.orderService.getOrder(order.id).subscribe({
      next: (res) => {
        this.selectedOrderRecipes.set(res.data.recipes);
        this.loadingRecipes.set(false);
      },
      error: () => this.loadingRecipes.set(false),
    });
  }

  completeOrder(order: Order) {
    this.completingId.set(order.id);

    this.orderService.completeOrder(order.id).subscribe({
      next: () => {
        this.completingId.set(null);
        this.orderService.loadOrders();
      },
      error: () => this.completingId.set(null),
    });
  }

  closeModal() {
    this.modalOpen.set(false);
    this.selectedOrderId.set(null);
    this.selectedOrderRecipes.set([]);
  }

  canComplete(order: Order): boolean {
    return order.status === 'in_kitchen';
  }
}