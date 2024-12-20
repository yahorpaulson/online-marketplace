import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { RetailComponent } from './retail/retail.component';
import { ProductListComponent } from './product-list/product-list.component';

export const routes: Routes = [
    { path: 'retail', component: RetailComponent, children: [{ path: '', component: ProductListComponent }] },
    { path: '', component: HomeComponent }
];
