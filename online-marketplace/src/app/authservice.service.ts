import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthserviceService {
  private tokenKey = 'authToken';
  private apiUrl: string = 'http://localhost:4000/api';

  constructor(private http: HttpClient) { }

  getToken(): string | null {
    const token = localStorage.getItem(this.tokenKey);
    if (token && !this.checkTokenExpiration(token)) {
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
      const payload = this.decodeToken(token);
      return payload?.userId || null;
    }
    return null;
  }

  register(payload: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, payload);
  }

  decodeToken(token: string): any | null {
    try {
      const base64Payload = token.split('.')[1];
      const payload = atob(base64Payload);
      return JSON.parse(payload);
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }



  checkTokenExpiration(token: string): boolean {
    const payload = this.decodeToken(token);
    if (payload?.exp) {
      const expirationDate = new Date(payload.exp * 1000);
      return expirationDate < new Date();
    }
    return true;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }




  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }
}
