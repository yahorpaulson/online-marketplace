import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { RetailComponent } from './retail/retail.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import {  VehicleComponent } from './Vehicle/vehicle.component';
import { AddVehicleComponent } from './add-vehicle/add-vehicle.component';
import { VehicleMarketComponent } from './vehicle-market/vehicle-market.component';


export const routes: Routes = [
    { path: 'retail', component: RetailComponent, children: [{ path: '', component: ProductListComponent }] },
    { path: '', component: HomeComponent },
    { path: 'retail/product/:id', component: ProductDetailsComponent },
    { path: 'vehicles', component: VehicleComponent },
    {path: 'add-vehicle',component: AddVehicleComponent},
    {path: 'vehicleMarket', component:VehicleMarketComponent},

];

