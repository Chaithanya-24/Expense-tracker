import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Expense } from '../../store/expense.model';
import { selectAllExpenses } from '../../store/expense.selectors';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports:[CommonModule, RouterModule],
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.css'],
})
export class ExpenseListComponent {
  private store = inject(Store);
  expenses$: Observable<Expense[]> = this.store.select(selectAllExpenses);
}
