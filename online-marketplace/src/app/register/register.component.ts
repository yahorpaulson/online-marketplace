import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthserviceService } from '../authservice.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [FormsModule]
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  role: string = 'buyer'; // Default 

  constructor(private authService: AuthserviceService, private router: Router) { }

  register() {
    if (!this.username.trim() || !this.password.trim()) {
      alert('Username and password are required.');
      return;
    }

    const payload = { username: this.username, password: this.password, role: this.role };

    this.authService.register(payload).subscribe({
      next: () => {
        alert('Registration successful!');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        alert(`Error: ${error.error.message || 'Registration failed'}`);
      },
    });
  }
}
