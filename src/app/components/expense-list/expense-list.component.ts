import { Component, inject, OnInit } from '@angular/core';
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
import {  FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { TimeagoModule } from 'ngx-timeago';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DropdownChangeEvent } from 'primeng/dropdown'; // Import the correct type
import { ChartModule } from 'primeng/chart';
import { ChartData } from 'chart.js';
import { ToolbarModule } from 'primeng/toolbar';
import {  MenubarModule } from 'primeng/menubar';
import { SelectModule } from 'primeng/select';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';

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
    ChartModule,
    ToolbarModule,
    MenubarModule,
    SelectModule,
    FloatLabelModule,
    InputTextModule,
    FormsModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.css']
})
export class ExpenseListComponent implements OnInit{

    // Placeholder for chart data, we will update it dynamically later
    pieChartData: ChartData<'pie'> | undefined; //  Use ChartData for Pie Chart
    lineChartData: ChartData<'line'> | undefined; //  Use ChartData for Line Chart

  private store = inject(Store);
  private router = inject(Router);
  private categoryService = inject(CategoryService);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  expenses$: Observable<Expense[]> = this.store.select(selectAllExpenses);
  displayForm: boolean = false;  // Controls the dialog visibility
  displayDialog: boolean = false;
  editDialogVisible: boolean = false; // Controls the Edit Expense Dialog
  selectedExpense: Expense | null = null; 
  selectedCategory: string | null = null;
  categories: { label: string; value: string }[] = [];
  expenses: Expense[] = [];
  filteredExpenses: Expense[] = [];
  updatedExpense: Expense [] = [];

  updateLocalStorage() {
    localStorage.setItem('expenses', JSON.stringify(this.expenses));
  }
  
  showDialog(expense?: Expense) {
    if (expense) {
      this.selectedExpense = { ...expense }; // Clone to prevent direct mutation
    } else {
      this.selectedExpense = null; // New expense
    }
    this.displayDialog = true;
  }

  filterExpenses(event: Event, dt: Table | null) {
    if (dt) {
      const inputElement = event.target as HTMLInputElement; // Type assertion for the target
      dt.filterGlobal(inputElement.value, 'contains');
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
      dismissableMask: true, //  Allows closing when clicking outside
      acceptButtonStyleClass: 'p-button-danger', //  Red Delete Button
      rejectButtonStyleClass: 'p-button-secondary', //  Grey Cancel Button
      accept: () => {
        this.onDelete(expenseId); //  Call delete method if accepted
      }
    });
  }

  closeDialog() {
    this.displayDialog = false;
    this.selectedExpense = null;
  }
  
  editExpense(expense: Expense) {
    // console.log("pressed");
    // console.log(expense.id);
    this.selectedExpense = { ...expense };
    // console.log(this.selectedExpense.id);
    this.editDialogVisible = true;
  }
  
  generateUniqueId(): number {
    if (!this.expenses || this.expenses.length === 0) {
      return 1; // Start from 1 if the list is empty
    }
    const maxId = Math.max(...this.expenses.map(expense => expense.id));
    return maxId + 1; // Assign the next unique number
  }
  

  handleExpenseUpdate(updatedExpense: Expense) {
    this.expenses = this.expenses.map(exp => 
      exp.id === updatedExpense.id ? updatedExpense : exp
    );
    this.updateLocalStorage();
    this.editDialogVisible = false;
  }
  

  ngOnInit() {
    this.store.select(selectAllExpenses).subscribe((data) => {
      this.expenses = data.map(expense => {
        if (!expense.date || isNaN(Date.parse(expense.date))) {
          console.error("Invalid date detected:", expense.date);
          return { ...expense, date: new Date().toISOString().split('T')[0] }; // Assign current date if invalid
        }
        return { 
          ...expense, 
          date: expense.date.includes('T') ? expense.date : new Date(expense.date).toISOString().split('T')[0]
        };
      });
    
      this.filteredExpenses = [...this.expenses];
      this.updatePieChart(); // Update the Pie Chart
      this.updateLineChart(this.expenses); // Update the Line Chart
    });
    
  
    this.categoryService.categories$.subscribe((data: string[]) => {
      // console.log('Categories fetched:', data); // Debugging
      this.categories = [
        { label: "All", value: "all" }, // Add "All" option
        ...data.map(category => ({ 
          label: category.trim(), 
          value: category.trim().toLowerCase() 
        }))
      ];
    });
    
    this.categoryService.fetchCategories();
  }

  getFormattedDate(date: string): string {
    const today = new Date();
    const givenDate = new Date(date);
    const differenceInDays = Math.floor((today.getTime() - givenDate.getTime()) / (1000 * 3600 * 24));
  
    return differenceInDays < 30 
      ? date // Use timeago pipe in the template
      : givenDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }
  

  onCategoryChange(event: DropdownChangeEvent) {
    this.selectedCategory = event?.value || null;
    // console.log('Selected Category:', this.selectedCategory); // Debugging
  
    if (this.selectedCategory === "all" || !this.selectedCategory) {
      this.filteredExpenses = [...this.expenses]; // Reset to all expenses
    } else {
      this.filteredExpenses = this.expenses.filter(expense => 
        expense.category?.trim().toLowerCase() === this.selectedCategory
      );
    }
  }
  
  searchExpenses(query: string) {
    if (!query.trim()) {
      this.filteredExpenses = [...this.expenses]; // Reset to full list if empty query
      return;
    }
  
    this.filteredExpenses = this.expenses.filter(expense =>
      expense.title.toLowerCase().includes(query.toLowerCase())
    );
  }

  onDelete(id: number) {
    this.store.dispatch(deleteExpense({ id }));

    // Remove from localStorage
    const storedExpenses = JSON.parse(localStorage.getItem('expenses') || '[]');
    const updatedExpenses = storedExpenses.filter((expense: Expense) => expense.id !== id);
    localStorage.setItem('expenses', JSON.stringify(updatedExpenses));

    // Show success message
    this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Expense deleted successfully' });
  }

  updatePieChart() {
    const categoryTotals: { [key: string]: number } = {};
  
    // Calculate total expenses per category
    this.expenses.forEach(expense => {
      if (categoryTotals[expense.category]) {
        categoryTotals[expense.category] += expense.amount;
      } else {
        categoryTotals[expense.category] = expense.amount;
      }
    });
  
    // Prepare data for the Pie Chart
    this.pieChartData = {
      labels: Object.keys(categoryTotals),
      datasets: [
        {
          data: Object.values(categoryTotals),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#FF9800'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#FF9800']
        }
      ]
    };
  }  
  updateLineChart(expenses: Expense[]) {
    const monthlyTotals: { [month: string]: number } = {};
  
    // Process each expense
    expenses.forEach(expense => {
      const month = new Date(expense.date).toLocaleString('en-US', { month: 'short', year: 'numeric' });
  
      if (!monthlyTotals[month]) {
        monthlyTotals[month] = 0;
      }
      monthlyTotals[month] += expense.amount;
    });
  
    // Extract labels and data
    const labels = Object.keys(monthlyTotals).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    const data = labels.map(month => monthlyTotals[month]);
  
    // Assign to chart
    this.lineChartData = {
      labels: labels,
      datasets: [
        {
          label: 'Monthly Expenses',
          data: data,
          borderColor: '#42A5F5',
          backgroundColor: 'rgba(66, 165, 245, 0.2)',
          fill: true
        }
      ]
    };
  }
  
}
