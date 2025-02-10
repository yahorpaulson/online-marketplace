import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { RetailComponent } from './retail/retail.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { AddProductComponent } from './add-product/add-product.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { MessageListComponent } from './message-list/message-list.component';

import {  VehicleComponent } from './Vehicle/vehicle.component';
import { AddVehicleComponent } from './add-vehicle/add-vehicle.component';
import { VehicleMarketComponent } from './vehicle-market/vehicle-market.component';
import { VehicleDetailComponent } from './vehicle-detail/vehicle-detail.component';


export const routes: Routes = [
    {
        path: 'retail',
        canActivate: [AuthGuard],
        component: RetailComponent,
        children: [
            { path: '', component: ProductListComponent },
            { path: 'product/:id', component: ProductDetailsComponent },
            { path: 'add-product', component: AddProductComponent },
            { path: 'messages', component: MessageListComponent },

        ],
    },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: '', component: HomeComponent },
    { path: 'retail/product/:id', component: ProductDetailsComponent },
    { path: 'vehicles', component: VehicleComponent },
    {path: 'add-vehicle',component: AddVehicleComponent},
    {path: 'vehicleMarket', component:VehicleMarketComponent},
    { path: 'vehicles/:id', component: VehicleDetailComponent }, // Detail page route
];



