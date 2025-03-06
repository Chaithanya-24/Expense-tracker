import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadCategories } from './features/categories/store/categories.actions';
import { ExpenseListComponent } from './features/expenses/components/expense-list/expense-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports:[ExpenseListComponent],
  template: `<app-expense-list></app-expense-list>`, // Display the component here

})
export class AppComponent {
  private store = inject(Store);
    title = 'Expense Tracker App'
  constructor() {
    this.store.dispatch(loadCategories()); // Dispatch action when the app loads
  }
}


