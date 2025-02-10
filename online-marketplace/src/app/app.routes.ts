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
];
