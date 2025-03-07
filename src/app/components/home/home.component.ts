import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseListComponent } from '../expense-list/expense-list.component';
import { CategoryListComponent } from "../category-list/category-list.component";
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,
    RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  categories: string[] = [];

  constructor() { }

  ngOnInit(): void {
    // Initialize categories here if needed
  }
}