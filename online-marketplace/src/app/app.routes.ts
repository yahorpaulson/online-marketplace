import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { RetailComponent } from './retail/retail.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { AddProductComponent } from './add-product/add-product.component';

export const routes: Routes = [
    {
        path: 'retail',
        component: RetailComponent,
        children: [
            { path: '', component: ProductListComponent }, // Рендерит список продуктов
            { path: 'product/:id', component: ProductDetailsComponent }, // Рендерит детали продукта
            { path: 'add-product', component: AddProductComponent }, // Рендерит форму добавления
        ],
    },
    { path: '', component: HomeComponent },
];

