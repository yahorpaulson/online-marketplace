import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { RetailComponent } from './retail/retail.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import {  VehicleComponent } from './Vehicle/vehicle.component';


export const routes: Routes = [
    { path: 'retail', component: RetailComponent, children: [{ path: '', component: ProductListComponent }] },
    { path: '', component: HomeComponent },
    { path: 'retail/product/:id', component: ProductDetailsComponent },
    { path: 'vehicle', component: VehicleComponent },

];

