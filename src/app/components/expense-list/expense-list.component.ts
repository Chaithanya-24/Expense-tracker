import { Component, inject, NgModule, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Expense } from '../../store/expense.model';
import { selectAllExpenses } from '../../store/expense.selectors';
import { Router, RouterModule } from '@angular/router';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { ExpenseFormComponent } from '../expense-form/expense-form.component';
import { deleteExpense } from '../../store/expense.actions';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { TimeagoModule } from 'ngx-timeago';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [
    CommonModule, 
    TableModule, 
    ButtonModule, 
    DialogModule, 
    ExpenseFormComponent, 
    RouterModule, 
    IconFieldModule, 
    InputIconModule, 
    DropdownModule,
    ConfirmDialogModule,
    ToastModule,
    TimeagoModule,
    FormsModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.css']
})
export class ExpenseListComponent implements OnInit{
  private store = inject(Store);
  private router = inject(Router);
  expenses$: Observable<Expense[]> = this.store.select(selectAllExpenses);
  displayForm: boolean = false;  // Controls the dialog visibility
  displayDialog: boolean = false;
  selectedExpense: Expense | null = null; 
  selectedCategory: string | null = null;
  categories: { label: string; value: string }[] = [];
  expenses: Expense[] = [];
  filteredExpenses: Expense[] = [];
  private categoryService = inject(CategoryService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);



  showDialog(expense?: Expense) {
    if (expense) {
      this.selectedExpense = { ...expense }; // Clone to prevent direct mutation
    } else {
      this.selectedExpense = null; // New expense
    }
    this.displayDialog = true;
  }

  filterExpenses(event: any, dt: Table | null) {
    if (dt) {
      dt.filterGlobal(event.target.value, 'contains');
    }
  }

  filterByCategory(selectedCategory: string) {
    this.selectedCategory = selectedCategory;
  
    if (selectedCategory) {
      this.filteredExpenses = this.expenses.filter(expense => expense.category === selectedCategory);
    } else {
      this.filteredExpenses = [...this.expenses]; // Show all if no filter
    }
  }
  
  
  confirmDelete(expenseId: number) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this expense?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Delete',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-danger', // ✅ Red Delete Button
      rejectButtonStyleClass: 'p-button-secondary', // ✅ Grey Cancel Button
      accept: () => {
        this.onDelete(expenseId); // ✅ Call delete method if accepted
      }
    });
  }

  closeDialog() {
    this.displayDialog = false;
    this.selectedExpense = null;
  }
  onUpdateExpense(expense: Expense) {
    this.showDialog(expense); // Open dialog in edit mode
  }

  ngOnInit() {
    this.store.select(selectAllExpenses).subscribe((data) => {
      this.expenses = data.map(expense => {
        if (!expense.date || isNaN(Date.parse(expense.date))) {
          console.error("Invalid date detected:", expense.date);
          return { ...expense, date: new Date().toISOString() }; // Assign current date if invalid
        }
        return { 
          ...expense, 
          date: expense.date.includes('T') ? expense.date : new Date(expense.date).toISOString()
        };
      });
    
      this.filteredExpenses = [...this.expenses];
    });
    
  
    this.categoryService.categories$.subscribe((data) => {
      console.log('Categories fetched:', data); // Debugging
      this.categories = data.map(category => ({ 
        label: category.trim(), 
        value: category.trim().toLowerCase() 
      }));
    });
  
    this.categoryService.fetchCategories();
  }
  
  

  onCategoryChange(event: any) {
    this.selectedCategory = event?.value || null;
    console.log('Selected Category:', this.selectedCategory); // Debugging
  
    if (this.selectedCategory) {
      this.filteredExpenses = this.expenses.filter(expense => 
        expense.category?.trim().toLowerCase() === this.selectedCategory
      );
    } else {
      this.filteredExpenses = [...this.expenses]; // Show all expenses when no category is selected
    }
  }
  
  
  onAddExpense() {
    this.router.navigate(['/add-expense']);
  }

  // onUpdateExpense(expense: Expense) {
  //   this.store.dispatch(updateExpense({ expense }));
  //   this.router.navigate(['/edit-expense', expense.id]); // Redirect after updating         
  //   // this.router.navigate(['/expenses']); // Redirect after updating
  // }

  onDelete(id: number) {
    this.store.dispatch(deleteExpense({ id }));

    // Remove from localStorage
    const storedExpenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    const updatedExpenses = storedExpenses.filter((expense: Expense) => expense.id !== id);
    localStorage.setItem('expenses', JSON.stringify(updatedExpenses));

    // Show success message
    this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Expense deleted successfully' });
  }
  
}
