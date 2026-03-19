import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface Order {
  id: string;
  status: 'pending' | 'preparing' | 'in_kitchen' | 'completed' | 'failed';
  quantity_requested: number;
  quantity_completed: number;
  created_at: string;
  recipes: { id: string; name: string }[];
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private api = `${environment.apiUrl}/orders`;
  private apiComplete = `${environment.apiUrl}/kitchen/orders`;

  orders = signal<Order[]>([]);
  loading = signal(false);

  constructor(private http: HttpClient) {}

  createOrder(quantity: number) {
    return this.http.post<{ success: boolean; data: { orderId: string; status: string } }>(
      this.api,
      { quantity },
    );
  }

  getOrder(id: string) {
    return this.http.get<{ success: boolean; data: Order }>(`${this.api}/${id}`);
  }

  getOrders() {
    return this.http.get<{ success: boolean; data: Order[] }>(this.api);
  }

  loadOrders() {
    this.loading.set(true);
    this.getOrders().subscribe({
      next: (res) => {
        this.orders.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  completeOrder(id: string) {
    return this.http.patch<{ success: boolean; data: any }>(`${this.apiComplete}`, {
      orderId: id,
    });
  }
}
