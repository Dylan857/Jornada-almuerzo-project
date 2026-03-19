import { Component, inject } from '@angular/core';
import { WarehouseService } from '../../../../core/services/warehouse.service';

@Component({
  selector: 'app-recipe-grid',
  imports: [],
  templateUrl: './recipe-grid.html',
})
export class RecipesGrid {
  warehouseService = inject(WarehouseService);
}
