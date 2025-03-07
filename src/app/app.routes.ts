import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ExpenseDetailsComponent } from './components/expense-details/expense-details.component';
import { ExpenseFormComponent } from './components/expense-form/expense-form.component';
import { ExpenseListComponent } from './components/expense-list/expense-list.component';
import { CategoryExpensesComponent } from './components/category-expenses/category-expenses.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'expenses', component: ExpenseListComponent },
  { path: 'add-expense', component: ExpenseFormComponent },
  { path: 'category/:category', component: CategoryExpensesComponent },
  { path: 'expense/:id', component: ExpenseDetailsComponent }, // Add this route // Lazy Loading HomeComponent
];
