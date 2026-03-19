import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface Ingredient {
  id: string;
  name: string;
  stock: number;
}

@Injectable({ providedIn: 'root' })
export class WarehouseService {
  private api = `${environment.apiUrl}/warehouse`;

  ingredients = signal<Ingredient[]>([]);
  recipes = signal<any[]>([]);
  loading = signal(false);

  constructor(private http: HttpClient) {}

  getInventory() {
    return this.http.get<{ success: boolean; data: Ingredient[] }>(this.api);
  }

  loadInventory() {
    this.loading.set(true);
    this.getInventory().subscribe({
      next: (res) => {
        this.ingredients.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  getRecipes() {
    return this.http.get<{ success: boolean; data: any[] }>(`${this.api}/recipes`);
  }

  loadRecipes() {
    this.loading.set(true);
    this.getRecipes().subscribe({
      next: (res) => {
        this.recipes.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
