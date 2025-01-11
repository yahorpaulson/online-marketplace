import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) { }

  login() {
    const payload = { username: this.username, password: this.password };

    this.http.post<{ token: string }>('http://localhost:4000/api/login', payload).subscribe({
      next: (response) => {
        localStorage.setItem('authToken', response.token);
        alert('Login successful!');
        this.router.navigate(['/']);
      },
      error: (error) => {
        alert(`Error: ${error.error.message || 'Login failed'}`);
      },
    });
  }
}
