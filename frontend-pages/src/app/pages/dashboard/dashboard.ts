import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../core/services/order.service';
import { WarehouseService } from '../../core/services/warehouse.service';
import { MarketService } from '../../core/services/market.service';
import { OrderTable } from './components/order-table/order-table';
import { OrderButton } from './components/order-button/order-button';
import { InventoryTable } from './components/inventory-table/inventory-table';
import { PurchaseTable } from './components/purchase-table/purchase-table';
import { RecipesGrid } from './components/recipe-grid/recipe-grid';
import { ChatBubble } from './components/chat-bubble/chat-bubble';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    OrderTable,
    OrderButton,
    InventoryTable,
    PurchaseTable,
    RecipesGrid,
    ChatBubble,
  ],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit, OnDestroy {
  private orderService = inject(OrderService);
  private warehouseService = inject(WarehouseService);
  private marketService = inject(MarketService);

  private pollingInterval: any;

  ngOnInit() {
    this.loadAll();
    this.pollingInterval = setInterval(() => this.loadAll(), 5000);
  }

  ngOnDestroy() {
    clearInterval(this.pollingInterval);
  }

  private loadAll() {
    this.orderService.loadOrders();
    this.warehouseService.loadInventory();
    this.warehouseService.loadRecipes();
    this.marketService.loadPurchases();
  }
}
