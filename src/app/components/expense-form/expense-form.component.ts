import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Expense } from '../../state/expense.model';
import { addExpense, updateExpense, deleteExpense } from '../../state/expense.actions';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { selectAllExpenses } from '../../state/expense.selectors';
import { map, Observable } from 'rxjs';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.css'],
  imports: [FormsModule, CommonModule, ToolbarModule, ButtonModule, DialogModule, InputTextModule, CalendarModule, DropdownModule, TableModule, ToastModule, ConfirmDialogModule, MessageModule
  ],
})
export class ExpenseFormComponent implements OnInit {
  private store = inject(Store);
  private http = inject(HttpClient);

  expenses$: Observable<Expense[]> = this.store.select(selectAllExpenses);
  categories: string[] = []; 
  editingId: number | null = null;
  expense: Expense = { id: 0, title: '', amount: 0, category: '', date: '' };

  categoryDialog: boolean = false; 
  selectedCategory: string = '';
  filteredExpenses: Expense[] = [];

  ngOnInit() {
    this.fetchCategories();
    this.expenses$ = this.expenses$.pipe(
        map((expenses: Expense[] | null) => expenses || [])
    );
  }

  fetchCategories() {
    this.http.get<string[]>('https://fakestoreapi.com/products/categories').subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
      },
    });
  }

  openCategoryDialog() {
    this.categoryDialog = true;
  }

  filterExpenses() {
    this.expenses$.subscribe(expenses => {
      this.filteredExpenses = expenses.filter(expense => expense.category === this.selectedCategory);
    });
  }

  saveExpense() {
    if (!this.expense.title || !this.expense.amount) return;

    if (this.editingId !== null) {
      this.store.dispatch(updateExpense({ expense: this.expense }));
    } else {
      this.expense.id = Math.floor(Math.random() * 1000);
      this.store.dispatch(addExpense({ expense: this.expense }));
    }

    this.resetForm();
  }

  editExpense(expense: Expense) {
    this.expense = { ...expense };
    this.editingId = expense.id;
  }

  deleteExpense(id: number) {
    this.store.dispatch(deleteExpense({ id }));
    if (this.editingId === id) this.resetForm();
  }

  resetForm() {
    this.expense = { id: 0, title: '', amount: 0, category: '', date: '' };
    this.editingId = null;
  }
}

