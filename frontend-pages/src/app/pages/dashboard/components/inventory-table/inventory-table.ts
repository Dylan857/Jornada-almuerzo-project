import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarehouseService } from '../../../../core/services/warehouse.service';

@Component({
  selector: 'app-inventory-table',
  imports: [],
  templateUrl: './inventory-table.html',
})
export class InventoryTable {
  warehouseService = inject(WarehouseService);

  stockClass(stock: number): string {
    if (stock <= 2) return 'text-red-600 font-semibold';
    if (stock <= 5) return 'text-yellow-600';
    return 'text-green-600';
  }

  stockBadge(stock: number): string {
    if (stock <= 2) return 'bg-red-100 text-red-700';
    if (stock <= 5) return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  }
}