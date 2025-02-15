import { Routes } from '@angular/router';
import { RetailComponent } from './retail/retail.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { AddProductComponent } from './add-product/add-product.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { MessageListComponent } from './message-list/message-list.component';
import { HomeComponent } from './home/home.component';
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
    
    {
        path: 'vehicleMarket',
        canActivate: [AuthGuard], 
        component: VehicleMarketComponent,
        children: [
            { path: '', redirectTo: 'vehicles', pathMatch: 'full' },  // Umleitung zur Fahrzeugliste
            { path: 'vehicles', component: VehicleComponent },
            { path: 'add-vehicle', component: AddVehicleComponent },
            { path: 'vehicles/:id', component: VehicleDetailComponent, data: { renderMode: 'server', prerender: false } }
        ]
    },

    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: '', component: HomeComponent },
    
    
];



