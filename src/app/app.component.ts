import { Component } from '@angular/core';
import {  RouterOutlet } from '@angular/router';
// import { ExpenseFormComponent } from "./components/expense-form/expense-form.component";
// import { ExpenseListComponent } from "./components/expense-list/expense-list.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'spendwise';
}
