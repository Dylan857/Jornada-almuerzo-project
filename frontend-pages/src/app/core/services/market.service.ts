import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';


export interface Purchase {
  name: string;
  quantity: number;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class MarketService {
  private api = `${environment.apiUrl}/market`;

  purchases = signal<Purchase[]>([]);
  loading = signal(false);

  constructor(private http: HttpClient) {}

  getPurchases() {
    return this.http.get<{ success: boolean; data: Purchase[] }>(`${this.api}/history`);
  }

  loadPurchases() {
    this.loading.set(true);
    this.getPurchases().subscribe({
      next: (res) => {
        this.purchases.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}