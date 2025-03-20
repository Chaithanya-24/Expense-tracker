
import { Component, EventEmitter, inject, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { Expense } from '../../store/expense.model';
import { addExpense, updateExpense, loadExpenses } from '../../store/expense.actions';
import { Observable, take } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from '../../services/local-storage.service';
import { selectAllExpenses } from '../../store/expense.selectors';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    DropdownModule,
    InputTextModule,
    FloatLabelModule,
    ToastModule
  ],
  templateUrl: './expense-form.component.html',
  providers: [LocalStorageService, MessageService],
  styleUrls: ['./expense-form.component.css'],
})
export class ExpenseFormComponent implements OnInit {
  private store = inject(Store);
  private http = inject(HttpClient);
  private localStorageService = inject(LocalStorageService);
  private route = inject(ActivatedRoute);
  private messageService = inject(MessageService);


  @Input() selectedExpense: Expense | null = null;
  @Output() formClosed = new EventEmitter<void>();
  @Output() expenseSaved = new EventEmitter<Expense>(); // Event to emit the saved expense

  expenses$: Observable<Expense[]> = this.store.select(selectAllExpenses);
  categories: string[] = [];
  categoryOptions: { label: string; value: string }[] = [];
  expense: Expense = { id: 0, title: '', amount: 0, category: '', date: '' };
  displayDialog: boolean = false;
  editingId: number | null = null;
  isEditMode: boolean = false;
  expenseForm!: FormGroup;
  constructor ( private fb: FormBuilder ) { }
  // expenseForm!: FormGroup;

  ngOnInit() {
    this.fetchCategories();
    this.loadExpensesFromLocalStorage();
  
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.editingId = Number(id);
        this.isEditMode = true; // Indicate we're editing
        this.expenses$.pipe(take(1)).subscribe(expenses => {
          const foundExpense = expenses.find(exp => exp.id === this.editingId);
          if (foundExpense) {
            this.expense = { ...foundExpense };
            this.displayDialog = true;
          }
        });
      } else {
        this.isEditMode = false;
      }
    });
  }

  
  // ngOnChanges() {
  //   if (this.selectedExpense) {
  //     this.expenseForm.patchValue(this.expense); // Pre-fill the form
  //   }
  // }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['expense'] && this.expenses$) {
      if (!this.expenseForm) {
        this.initForm(); // Ensure form is initialized
      }
      if (this.selectedExpense) { // Add a null check
        this.expenseForm.patchValue(this.selectedExpense);
      }
  }
}

  initForm() {
    this.expenseForm = this.fb.group({
      title: [''],
      amount: [0],
      category: [''],
      date: ['']
    });

    if (this.expenses$) {
      this.expenseForm.patchValue(this.expenses$);
    }
  }

  
  loadExpenses(id: number) {
    const expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    this.expense = expenses.find((exp: { id: number; }) => exp.id === id) || {};
  }
  fetchCategories() {
    this.http.get<string[]>('https://fakestoreapi.com/products/categories').subscribe({
      next: (data) => {
        this.categories = data;
        this.categoryOptions = data.map(cat => ({ label: cat, value: cat }));
      },
      error: (err) => console.error('Error fetching categories:', err),
    });
  }

  loadExpensesFromLocalStorage() {
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

  onSubmit() {
    if (!this.expense.title || !this.expense.amount || !this.expense.category || !this.expense.date) {
      return; // Ensure all fields are filled
    }
  
    this.expenses$.pipe(take(1)).subscribe(expenses => {
      if (this.isEditMode && this.editingId !== null) {
        // **Editing existing expense**
        this.store.dispatch(updateExpense({ expense: this.expense }));
  
        // Update localStorage
        const updatedExpenses = expenses.map(exp =>
          exp.id === this.expense.id ? this.expense : exp
        );
        this.localStorageService.setItem('expenses', JSON.stringify(updatedExpenses));
  
        // ✅ Show success toast for update
        this.messageService.add({ severity: 'success', summary: 'Expense Updated', detail: 'Expense updated successfully!' });
  
      } else {
        // **Adding a new expense**
        const newExpense: Expense = {
          id: Date.now(), // Unique ID
          title: this.expense.title,
          amount: this.expense.amount,
          category: this.expense.category,
          date: this.expense.date || new Date().toISOString().split('T')[0] 
        };
  
        this.store.dispatch(addExpense({ expense: newExpense }));
  
        // Update localStorage
        const updatedExpenses = [...expenses, newExpense];
        this.localStorageService.setItem('expenses', JSON.stringify(updatedExpenses));
  
        // ✅ Show success toast for addition
        this.messageService.add({ severity: 'success', summary: 'Expense Added', detail: 'New expense added successfully!' });
      }
  
      this.closeDialog();
    });
  }
  


  closeDialog() {
    this.displayDialog = false;
    this.expense = { id: 0, title: '', amount: 0, category: '', date: '' }; // Reset form
    this.isEditMode = false;
    this.editingId = null;
    this.formClosed.emit();
  }

  showAddExpenseDialog() {
    this.editingId = null; // Reset edit mode
    this.expense = { id: 0, title: '', amount: 0, category: '', date: '' }; // Reset form
    this.displayDialog = true;
  }
}
