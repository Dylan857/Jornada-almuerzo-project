import { Component, inject } from '@angular/core';
import { MarketService } from '../../../../core/services/market.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-purchase-table',
  imports: [DatePipe],
  templateUrl: './purchase-table.html',
})
export class PurchaseTable {
  marketService = inject(MarketService);
}