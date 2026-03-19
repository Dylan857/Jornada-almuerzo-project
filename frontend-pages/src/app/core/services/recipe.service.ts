import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface Recipe {
  id: string;
  name: string;
  ingredients: { name: string; quantity: number }[];
}

@Injectable({ providedIn: 'root' })
export class RecipeService {
  private api = `${environment.apiUrl}/warehouse`;

  recipes = signal<Recipe[]>([]);

  constructor(private http: HttpClient) {}

  getRecipes() {
    return this.http.get<{ success: boolean; data: Recipe[] }>(`${this.api}/recipes`);
  }

  loadRecipes() {
    this.getRecipes().subscribe({
      next: (res) => this.recipes.set(res.data)
    });
  }
}