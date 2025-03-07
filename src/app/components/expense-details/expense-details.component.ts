import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Expense } from '../../state/expense.model';
import { CommonModule } from '@angular/common';
import { Router } from 'express';

@Component({
  selector: 'app-expense-details',
  standalone: true,
  templateUrl: './expense-details.component.html',
  styleUrls: ['./expense-details.component.css'],
  imports: [CommonModule, RouterModule],
})
export class ExpenseDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private store = inject(Store);

  expense: Expense | undefined;

  ngOnInit() {
    const expenseId = Number(this.route.snapshot.paramMap.get('id'));
    this.store.select('expenses').subscribe((expenses: Expense[]) => {
      this.expense = expenses.find((e) => e.id === expenseId);
    });
  }
}
