import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ShoppingListService } from './service/shopping-list.service';
import * as fromShoppingList from './store/shopping-list.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {

  ingredientsObs: Observable<fromShoppingList.State>;

  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit(): void {
    this.ingredientsObs = this.shoppingListService.getShoppingListSate();
  }

  ngOnDestroy(): void {
  }

  onEditIngredient(ingredientName: string): void {
    this.shoppingListService.startEditingIngredient(ingredientName);
  }

}
