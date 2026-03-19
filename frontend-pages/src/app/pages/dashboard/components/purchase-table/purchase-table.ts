import { Component, inject } from '@angular/core';
import { MarketService } from '../../../../core/services/market.service';

@Component({
  selector: 'app-purchase-table',
  imports: [],
  templateUrl: './purchase-table.html',
})
export class PurchaseTable {
  marketService = inject(MarketService);
}