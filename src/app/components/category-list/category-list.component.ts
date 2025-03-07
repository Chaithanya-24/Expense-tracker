import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-list',
  standalone: true,
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css'],
  imports: [CommonModule],
})
export class CategoryListComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  categories: string[] = [];

  ngOnInit() {
    this.fetchCategories();
  }

  fetchCategories() {
    this.http.get<string[]>('https://fakestoreapi.com/products/categories').subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
      },
    });
  }

  viewCategoryExpenses(category: string) {
    this.router.navigate([`/category/${category}`]); // Navigate to category expenses page
  }
}
