import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Expense } from '../../store/expense.model';
import { addExpense, updateExpense, deleteExpense, loadExpenses } from '../../store/expense.actions';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { selectAllExpenses } from '../../store/expense.selectors';
import { Observable, take } from 'rxjs';
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
import { LocalStorageService } from '../../services/local-storage.service'; // ✅ Import LocalStorageService

@Component({
  selector: 'app-expense-form',
  standalone: true,
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.css'],
  imports: [
    FormsModule, CommonModule, ToolbarModule, ButtonModule, DialogModule,
    InputTextModule, CalendarModule, DropdownModule, TableModule,
    ToastModule, ConfirmDialogModule, MessageModule
  ],
})
export class ExpenseFormComponent implements OnInit {
  private store = inject(Store);
  private http = inject(HttpClient);
  private localStorageService = inject(LocalStorageService); // ✅ Use local storage service

  expenses$: Observable<Expense[]> = this.store.select(selectAllExpenses);
  categories: string[] = []; 
  editingId: number | null = null;
  expense: Expense = { id: 0, title: '', amount: 0, category: '', date: '' };

  categoryDialog: boolean = false; 
  selectedCategory: string = '';
  filteredExpenses: Expense[] = [];

  ngOnInit() {
    this.fetchCategories();
  
    this.expenses$.pipe(take(1)).subscribe(expenses => {
      if (expenses.length === 0) {
        const storedExpenses = this.localStorageService.getItem('expenses');
        if (storedExpenses) {
          const parsedExpenses = JSON.parse(storedExpenses);
          if (Array.isArray(parsedExpenses) && parsedExpenses.length > 0) {
            this.store.dispatch(loadExpenses({ expenses: parsedExpenses }));
          }
        }
      }
    });
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
    this.expenses$.pipe(take(1)).subscribe(expenses => {
      this.filteredExpenses = expenses.filter(expense => expense.category === this.selectedCategory);
    });
  }

  saveExpense() {
    if (!this.expense || !this.expense.title || !this.expense.amount || !this.expense.category) {
      return; // Prevent adding empty expense
    }
  
    this.expenses$.pipe(take(1)).subscribe(expenses => {
      const existingExpense = expenses.find(exp => exp.id === this.expense.id);
  
      if (existingExpense) {
        this.store.dispatch(updateExpense({ expense: this.expense }));
      } else {
        this.expense.id = Math.floor(Math.random() * 1000);
        this.store.dispatch(addExpense({ expense: this.expense }));
      }
  
      // ✅ Save only unique expenses to localStorage
      const updatedExpenses = [...expenses.filter(exp => exp.id !== this.expense.id), this.expense];
      this.localStorageService.setItem('expenses', JSON.stringify(updatedExpenses));
  
      this.resetForm();
    });
  }
  

  editExpense(expense: Expense) {
    this.expense = { ...expense };
    this.editingId = expense.id;
  }

  deleteExpense(id: number) {
    this.store.dispatch(deleteExpense({ id }));

    // ✅ Update localStorage after deleting
    this.expenses$.pipe(take(1)).subscribe(expenses => {
      const updatedExpenses = expenses.filter(expense => expense.id !== id);
      this.localStorageService.setItem('expenses', JSON.stringify(updatedExpenses));
    });

    if (this.editingId === id) this.resetForm();
  }

  resetForm() {
    this.expense = { id: 0, title: '', amount: 0, category: '', date: '' };
    this.editingId = null;
  }
}
