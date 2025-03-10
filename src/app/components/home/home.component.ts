import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, RouterModule],
})
export class HomeComponent implements OnInit {
  private http = inject(HttpClient);
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
}
