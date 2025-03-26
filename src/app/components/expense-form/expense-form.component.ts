
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
import { distinctUntilChanged } from 'rxjs/operators';

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

  expenses$: Observable<Expense[]> = this.store.select(selectAllExpenses).pipe(distinctUntilChanged());
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
    this.initForm(); // Ensure the form exists
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
            this.expense.date = this.expense.date ? this.expense.date.split('T')[0] : '';  // Converts "2025-03-25T00:00:00.000Z" to "2025-03-25"
            this.displayDialog = true;
          }
        });
      } else {
        this.isEditMode = false;
      }
    });
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedExpense'] && this.selectedExpense) {
      if (!this.expenseForm) {
        this.initForm(); // Ensure form is initialized
      }
      const formattedDate = this.formatDate(this.selectedExpense.date);

      if (this.selectedExpense) { // Add a null check
        this.expenseForm.patchValue({...this.selectedExpense, date: formattedDate,});
      }
      this.expense = { ...this.selectedExpense }; // ✅ Copy selected expense
      this.displayDialog = true; // Ensure dialog opens when editing
  }
}

formatDate(date: string): string {
  return date ? new Date(date).toISOString().split('T')[0] : '';
}

  initForm() {
    this.expenseForm = this.fb.group({
      title: [''],
      amount: [ ],
      category: [''],
      date: ['']
    });
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
        // **Find the index of the expense being edited**
        const expenseIndex = expenses.findIndex(exp => exp.id === this.editingId);
  
        if (expenseIndex !== -1) {
          const updatedExpenses = [...expenses];
          updatedExpenses[expenseIndex] = this.expense; // ✅ Replace instead of appending
          this.store.dispatch(updateExpense({ expense: this.expense }));
          this.store.select(selectAllExpenses).pipe(take(1)).subscribe(updatedExpenses => {
          console.log("Updated expenses from store:", updatedExpenses);
          });
          this.messageService.add({ severity: 'success', summary: 'Expense Updated', detail: 'Expense updated successfully!' });
          this.localStorageService.setItem('expenses', JSON.stringify(updatedExpenses)); // ✅ Correct local storage update
        }
      } else {
        const lastId = Number(localStorage.getItem('lastExpenseId') || '0') + 1;
        localStorage.setItem('lastExpenseId', String(lastId));
        // **Adding a new expense**
        const newExpense: Expense = {
          id: lastId, 
          title: this.expense.title,
          amount: this.expense.amount,
          category: this.expense.category,
          date: this.expense.date || new Date().toISOString().split('T')[0]
        };
  
        this.store.dispatch(addExpense({ expense: newExpense })); 
        const updatedExpenses = [...expenses, newExpense]; // ✅ Append only when adding
        this.localStorageService.setItem('expenses', JSON.stringify(updatedExpenses));
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
    this.expense = this.selectedExpense 
    ? { ...this.selectedExpense } // ✅ Use selected expense if available
    : { id: 0, title: '', amount: 0, category: '', date: '' };
     this.displayDialog = true;
  }
}
