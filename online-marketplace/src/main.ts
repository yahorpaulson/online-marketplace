import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { MessageService } from './app/services/message.service';
import { ProductService } from './app/services/product.service';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    HttpClient,
    MessageService,
    ProductService,
  ],
});
