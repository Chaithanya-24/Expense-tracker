import { Routes } from '@angular/router';
import { ExpenseFormComponent } from './components/expense-form/expense-form.component';
import { ExpenseListComponent } from './components/expense-list/expense-list.component';


export const routes: Routes = [
    {
        path:'',
        redirectTo: '/expenses',
        pathMatch: 'full'
    },
    // { 
    //     path: 'expense/:id', 
    //     component: ExpenseItemComponent
    // },
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

//   { path: 'category/:category', component: CategoryExpensesComponent },

];
