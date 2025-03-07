import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { Expense } from '../../state/expense.model';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-category-expenses',
  standalone: true,
  templateUrl: './category-expenses.component.html',
  styleUrls: ['./category-expenses.component.css'],
  imports: [CommonModule],
})
export class CategoryExpensesComponent implements OnInit {
  private store = inject(Store<{ expenses: Expense[] }>);
  private route = inject(ActivatedRoute);

  category: string = '';
  filteredExpenses$: Observable<Expense[]> = new Observable();

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.category = params.get('category') || '';
      this.filterExpenses();
    });
  }

  filterExpenses() {
    this.filteredExpenses$ = this.store.select('expenses').pipe(
      map(expenses => expenses.filter((expenses: { category: string; }) => expenses.category === this.category))
    );
  }
}
