import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appStoreProviders } from './app/store/app.store';
import { provideHttpClient } from '@angular/common/http'; 
import { CategoriesEffects } from './app/features/categories/store/categories.effects';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store'
import { categoriesReducer } from './app/features/categories/store/categories.reducer';

bootstrapApplication(AppComponent, {
  providers: [appStoreProviders, 
    provideHttpClient(),
    provideStore(),
    provideState('categories', categoriesReducer),
    provideEffects(CategoriesEffects)
  ]
}).catch(err => console.error(err));

