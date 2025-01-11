import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {
  private tokenKey = 'authToken';
  private apiUrl: string = 'http://localhost:4000/api';

  constructor(private http: HttpClient) { }

  getToken(): string | null {
    const token = localStorage.getItem(this.tokenKey);
    if (token && !this.isTokenExpired()) {
      return token;
    }
    this.logout();
    return null;
  }


  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getUserId(): number | null {
    const token = this.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId;
      } catch (error) {
        console.error('Invalid token format');
        return null;
      }
    }
    return null;
  }
  register(payload: { username: string; password: string; role: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, payload);
  }


  getPayload(): any | null {
    const token = this.getToken();
    if (token) {
      try {
        const base64Payload = token.split('.')[1];
        const payload = atob(base64Payload);
        return JSON.parse(payload);
      } catch (error) {
        console.error('Failed to decode token payload:', error);
        return null;
      }
    }
    return null;
  }


  getUserRole(): string | null {
    const token = this.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role || null;
      } catch (error) {
        console.error('Invalid token format');
        return null;
      }
    }
    return null;
  }
  isTokenExpired(): boolean {
    const payload = this.getPayload();
    if (payload?.exp) {
      const expirationDate = new Date(payload.exp * 1000);
      return expirationDate < new Date();
    }
    return true;
  }
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  hasRole(role: string): boolean {
    return this.getUserRole() === role;
  }


  isSeller(): boolean {
    return this.getUserRole() === 'seller';
  }



  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }
}
