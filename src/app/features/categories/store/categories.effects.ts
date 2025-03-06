import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CategoriesService } from '../categories.service';
import {
  loadCategories,
  loadCategoriesFailure,
  loadCategoriesSuccess,
} from './categories.actions';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as CategoryActions from '../store/categories.actions';
import { of } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class CategoriesEffects {
  constructor(
    private actions$: Actions,
    private categoriesService: CategoriesService
  ) {
    console.log('CategoriesService :', this.categoriesService);
  }


  // loadCategories$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(CategoryActions.loadCategories), // Listen for loadCategories action
  //     mergeMap(() =>
  //       this.categoriesService.getCategories().pipe(
  //         map((categories) =>
  //           CategoryActions.loadCategoriesSuccess({ categories })
  //         ), // Dispatch success
  //         catchError((error) =>
  //           of(CategoryActions.loadCategoriesFailure({ error: error.message }))
  //         ) // Dispatch failure
  //       )
  //     )
  //   )
  // );

  // loadCategories$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(CategoryActions.loadCategories),
  //     mergeMap(() => {
  //       console.log('Calling getCategories...'); // 🔍 Debugging
  //       const result = this.categoriesService.getCategories();
  //       console.log('Service response:', result); // 🔍 Debugging

  //       return result.pipe(
  //         // This line is failing because result is undefined
  //         map((categories) =>
  //           CategoryActions.loadCategoriesSuccess({ categories })
  //         ),
  //         catchError((error) =>
  //           of(CategoryActions.loadCategoriesFailure({ error: error.message }))
  //         )
  //       );
  //     })
  //   )
  // );
}
