import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from './category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>('https://fakestoreapi.com/products/categories');
  }
}
