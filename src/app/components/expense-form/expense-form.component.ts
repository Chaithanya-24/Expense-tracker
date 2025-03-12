// import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
// import { Store } from '@ngrx/store';
// import { Expense } from '../../store/expense.model';
// import { addExpense, updateExpense, deleteExpense, loadExpenses } from '../../store/expense.actions';
// import { Observable, map, take } from 'rxjs';
// import { ActivatedRoute, Router } from '@angular/router';
// import { SelectModule } from 'primeng/select';
// import { HttpClient } from '@angular/common/http';
// import { LocalStorageService } from '../../services/local-storage.service';
// import { selectAllExpenses } from '../../store/expense.selectors';
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule, FormsModule } from '@angular/forms';
// import  { NgModule } from '@angular/core';
// import { DialogModule } from 'primeng/dialog';
// import { ButtonModule } from 'primeng/button';
// import { DropdownModule } from 'primeng/dropdown';

// @Component({
//   selector: 'app-expense-form',
//   standalone: true,
//   imports: [SelectModule, CommonModule, ReactiveFormsModule, FormsModule, DialogModule, ButtonModule, DropdownModule],
//   templateUrl: './expense-form.component.html',
//   styleUrls: ['./expense-form.component.css'],
// })
// export class ExpenseFormComponent implements OnInit {
//   private store = inject(Store);
//   private http = inject(HttpClient);
//   private localStorageService = inject(LocalStorageService);
//   private route = inject(ActivatedRoute);
//   private router = inject(Router);

//   @Output() formClosed = new EventEmitter<void>();

//   expenses$: Observable<Expense[]> = this.store.select(selectAllExpenses);
//   categories: string[] = [];
//   editingId: number | null = null;
//   expense: Expense = { id: 0, title: '', amount: 0, category: '', date: '' };
//   searchTerm: string = '';  
//   sortOrder: 'asc' | 'desc' = 'desc'; 
//   categoryDialog: boolean = false;
//   selectedCategory: string = '';
//   displayDialog: boolean = false;

//   ngOnInit() {
//     this.fetchCategories();
//     this.loadExpensesFromLocalStorage();

//     // Check if we're in edit mode
//     this.route.paramMap.subscribe(params => {
//       const id = params.get('id');
//       if (id) {
//         this.editingId = Number(id);
//         this.expenses$.pipe(take(1)).subscribe(expenses => {
//           const foundExpense = expenses.find(exp => exp.id === this.editingId);
//           if (foundExpense) {
//             this.expense = { ...foundExpense };
//           }
//         });
//       }
//     });
//   }

//   fetchCategories() {
//     this.http.get<string[]>('https://fakestoreapi.com/products/categories').subscribe({
//       next: (data) => {
//         this.categories = data;
//       },
//       error: (err) => {
//         console.error('Error fetching categories:', err);
//       },
//     });
//   }
//   get isEditMode(): boolean {
//     return this.editingId !== null;
//   }
  
//   loadExpensesFromLocalStorage() {
//     this.expenses$.pipe(take(1)).subscribe(expenses => {
//       if (expenses.length === 0) {
//         const storedExpenses = this.localStorageService.getItem('expenses');
//         if (storedExpenses) {
//           const parsedExpenses = JSON.parse(storedExpenses);
//           if (Array.isArray(parsedExpenses) && parsedExpenses.length > 0) {
//             this.store.dispatch(loadExpenses({ expenses: parsedExpenses }));
//           }
//         }
//       }
//     });
//   }

//   toggleSort() {
//     this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
//   }

//   getFilteredExpenses(): Observable<Expense[]> {
//     return this.expenses$.pipe(
//       map(expenses =>
//         expenses
//           .filter(expense => expense.title.toLowerCase().includes(this.searchTerm.toLowerCase()))
//           .sort((a, b) => {
//             return this.sortOrder === 'asc'
//               ? new Date(a.date).getTime() - new Date(b.date).getTime()
//               : new Date(b.date).getTime() - new Date(a.date).getTime();
//           })
//       )
//     );
//   }

//   onSubmit() {
//     if (!this.expense.title || !this.expense.amount || !this.expense.category) {
//       return; 
//     }

//     this.expenses$.pipe(take(1)).subscribe(expenses => {
//       if (this.editingId !== null) {
//         // Update existing expense
//         this.store.dispatch(updateExpense({ expense: this.expense }));

//         // Update localStorage
//         const updatedExpenses = expenses.map(exp =>
//           exp.id === this.expense.id ? this.expense : exp
//         );
//         this.localStorageService.setItem('expenses', JSON.stringify(updatedExpenses));
//       } else {
//         // Add new expense
//         const newExpense: Expense = {
//           id: Math.floor(Math.random() * 10000), 
//           title: this.expense.title,
//           amount: this.expense.amount,
//           category: this.expense.category,
//           date: this.expense.date || new Date().toISOString().split('T')[0] 
//         };

//         this.store.dispatch(addExpense({ expense: newExpense }));

//         // Update localStorage
//         const updatedExpenses = [...expenses, newExpense];
//         this.localStorageService.setItem('expenses', JSON.stringify(updatedExpenses));
//       }

//       this.router.navigate(['/expenses']); 
//     });
//   }

//   updateExpense(expense: Expense) {
//     this.expense = { ...expense };
//     this.editingId = expense.id;
//   }

//   deleteExpense(id: number) {
//     this.store.dispatch(deleteExpense({ id }));

//     // Update localStorage
//     this.expenses$.pipe(take(1)).subscribe(expenses => {
//       const updatedExpenses = expenses.filter(expense => expense.id !== id);
//       this.localStorageService.setItem('expenses', JSON.stringify(updatedExpenses));
//     });

//     if (this.editingId === id) this.resetForm();
//   }

//   resetForm() {
//     this.expense = { id: 0, title: '', amount: 0, category: '', date: '' };
//     this.editingId = null;
//   }

//   openCategoryDialog() {
//     this.categoryDialog = true;
//   }
//   closeDialog() {
//     this.displayDialog = false;
//     this.router.navigate(['/expenses']);
//   }
//   closeCategoryDialog() {
//     this.categoryDialog = false;
//   }

//   filterExpensesByCategory() {
//     this.expenses$.pipe(take(1)).subscribe(expenses => {
//       this.expenses$ = new Observable(observer => {
//         observer.next(expenses.filter(expense => expense.category === this.selectedCategory));
//         observer.complete();
//       });
//     });
//   }
// }

import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Expense } from '../../store/expense.model';
import { addExpense, updateExpense, loadExpenses } from '../../store/expense.actions';
import { Observable, take } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from '../../services/local-storage.service';
import { selectAllExpenses } from '../../store/expense.selectors';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';

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
    FloatLabelModule
  ],
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.css'],
})
export class ExpenseFormComponent implements OnInit {
  private store = inject(Store);
  private http = inject(HttpClient);
  private localStorageService = inject(LocalStorageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  @Input() selectedExpense: Expense | null = null;
  @Output() formClosed = new EventEmitter<void>();

  expenses$: Observable<Expense[]> = this.store.select(selectAllExpenses);
  categories: string[] = [];
  categoryOptions: { label: string; value: string }[] = [];
  expense: Expense = { id: 0, title: '', amount: 0, category: '', date: '' };
  displayDialog: boolean = false;
  editingId: number | null = null;
  isEditMode: boolean = false;
  ngOnInit() {
    this.fetchCategories();
    this.loadExpensesFromLocalStorage();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (this.editingId) {
        this.isEditMode = true;
        this.loadExpenses(this.editingId);
      }
      if (id) {
        this.editingId = Number(id);
        this.expenses$.pipe(take(1)).subscribe(expenses => {
          const foundExpense = expenses.find(exp => exp.id === this.editingId);
          if (foundExpense) {
            this.expense = { ...foundExpense };
            this.displayDialog = true;
          }
        });
      }
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
      return;
    }

    this.expenses$.pipe(take(1)).subscribe(expenses => {
      if (this.editingId !== null) {
        // Update existing expense
        this.store.dispatch(updateExpense({ expense: this.expense }));

        // Update localStorage
        const updatedExpenses = expenses.map(exp =>
          exp.id === this.expense.id ? this.expense : exp
        );
        this.localStorageService.setItem('expenses', JSON.stringify(updatedExpenses));
      } else {
        // Add new expense
        const newExpense: Expense = {
          id: Date.now(), // Ensure unique ID
          title: this.expense.title,
          amount: this.expense.amount,
          category: this.expense.category,
          date: this.expense.date || new Date().toISOString().split('T')[0]
        };

        this.store.dispatch(addExpense({ expense: newExpense }));

        // Update localStorage
        const updatedExpenses = [...expenses, newExpense];
        this.localStorageService.setItem('expenses', JSON.stringify(updatedExpenses));
      }

      this.closeDialog(); // Close only after successful add/update
    });
  }

  closeDialog() {
    this.displayDialog = false;
    this.expense = { id: 0, title: '', amount: 0, category: '', date: '' }; // Reset form
    this.formClosed.emit();
  }

  showAddExpenseDialog() {
    this.editingId = null; // Reset edit mode
    this.expense = { id: 0, title: '', amount: 0, category: '', date: '' }; // Reset form
    this.displayDialog = true;
  }
}
