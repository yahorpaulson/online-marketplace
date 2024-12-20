import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { RetailComponent } from './retail/retail.component';

export const routes: Routes = [
    { path: 'retail', component: RetailComponent },
    { path: '', component: HomeComponent }
];
