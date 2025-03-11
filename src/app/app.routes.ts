import { Routes } from '@angular/router';
import { ExpenseDetailsComponent } from './components/expense-details/expense-details.component';
import { ExpenseFormComponent } from './components/expense-form/expense-form.component';
import { ExpenseListComponent } from './components/expense-list/expense-list.component';
import { CategoryExpensesComponent } from './components/category-expenses/category-expenses.component';
import { ExpenseItemComponent } from './components/expense-item/expense-item.component';

export const routes: Routes = [
    {
        path:'',
        redirectTo: '/expenses',
        pathMatch: 'full'
    },
    { 
        path: 'expense/:id', 
        component: ExpenseItemComponent
    },
    { 
        path: 'expenses', 
        component: ExpenseListComponent 
    },
    { 
        path: 'add-expense', 
        component: ExpenseFormComponent 
    },
    {
        path: 'edit-expense/:id',
        component: ExpenseFormComponent,
      },

//   { path: 'home', component: HomeComponent },
//   { path: 'expenses', component: ExpenseListComponent },
//   
//   { path: 'category/:category', component: CategoryExpensesComponent },

//   { path: '', redirectTo: '/home', pathMatch: 'full' },
  // Add this route // Lazy Loading HomeComponent
];
