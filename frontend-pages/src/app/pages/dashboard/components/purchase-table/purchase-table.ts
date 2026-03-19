import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketService } from '../../../../core/services/market.service';

@Component({
  selector: 'app-purchase-table',
  imports: [CommonModule],
  templateUrl: './purchase-table.html',
})
export class PurchaseTable {
  marketService = inject(MarketService);
}