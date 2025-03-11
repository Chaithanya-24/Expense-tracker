import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Expense } from '../../store/expense.model';
import { addExpense, updateExpense, deleteExpense, loadExpenses } from '../../store/expense.actions';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { selectAllExpenses } from '../../store/expense.selectors';
import { Observable, take } from 'rxjs';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
// import { DropdownModule } from 'primeng/dropdown';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageModule } from 'primeng/message';
import { LocalStorageService } from '../../services/local-storage.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.css'],
  imports: [
    FormsModule, 
    RouterModule,
    CommonModule, 
    ToolbarModule, 
    ButtonModule, 
    DialogModule,
    InputTextModule, 
    CalendarModule, 
    SelectModule, 
    TableModule,
    ToastModule, 
    ConfirmDialogModule, 
    MessageModule,
    ReactiveFormsModule
  ],
})
export class ExpenseFormComponent implements OnInit {
  private store = inject(Store);
  private http = inject(HttpClient);
  private localStorageService = inject(LocalStorageService);
  private router = inject(Router); // Inject the Router service
  @Output() formClosed = new EventEmitter<void>();  // Event to notify parent component


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

  closeCategoryDialog() {
    this.categoryDialog = false;
  }

  filterExpenses() {
    this.expenses$.pipe(take(1)).subscribe(expenses => {
      this.filteredExpenses = expenses.filter(expense => expense.category === this.selectedCategory);
    });
  }

  onSubmit() {
    if (!this.expense.title || !this.expense.amount || !this.expense.category) {
      return; // Prevent adding empty or incomplete expenses
    }

    this.expenses$.pipe(take(1)).subscribe(expenses => {
      if (this.editingId !== null) {
        // Update existing expense
        this.store.dispatch(updateExpense({ expense: this.expense }));
      } else {
        // Add new expense
        const newExpense: Expense = {
          id: Math.floor(Math.random() * 10000), // Generate a random unique ID
          title: this.expense.title,
          amount: this.expense.amount,
          category: this.expense.category,
          date: this.expense.date || new Date().toISOString().split('T')[0] // Default to today's date
        };

        this.store.dispatch(addExpense({ expense: newExpense }));

        // Update localStorage
        const updatedExpenses = [...expenses, newExpense];
        this.localStorageService.setItem('expenses', JSON.stringify(updatedExpenses));
      }
        this.formClosed.emit(); // Notify parent component
      this.resetForm();
      this.router.navigate(['/expenses']); // Use the router to navigate
    });
  }

  updateExpense(expense: Expense) {
    this.expense = { ...expense };
    this.editingId = expense.id;
  }

  deleteExpense(id: number) {
    this.store.dispatch(deleteExpense({ id }));

    // Update localStorage after deleting
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